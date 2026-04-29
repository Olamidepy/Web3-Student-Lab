use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Symbol,
};
use crate::blogging_platform::{BloggingPlatformClient, Post};

#[contracttype]
enum DataKey {
    PlatformAdmin,
    Earnings(Address),
    Subscriptions(Address, Address), // (subscriber, creator) -> expiry
}

#[contract]
pub struct ContentMonetization;

#[contractimpl]
impl ContentMonetization {
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::PlatformAdmin, &admin);
    }

    pub fn tip_creator(env: Env, tipper: Address, creator: Address, token: Address, amount: i128) {
        tipper.require_auth();

        let token_client = crate::token::RsTokenContractClient::new(&env, &token);
        // Using token_id 0 as default for TIPS
        token_client.transfer(&tipper, &creator, &0, &amount);

        // Track earnings
        let mut earnings: i128 = env.storage().persistent().get(&DataKey::Earnings(creator.clone())).unwrap_or(0);
        earnings += amount;
        env.storage().persistent().set(&DataKey::Earnings(creator.clone()), &earnings);

        env.events().publish(
            (Symbol::new(&env, "tip_sent"), tipper),
            (creator, amount),
        );
    }

    pub fn purchase_access(env: Env, user: Address, post_id: u64, blog_contract: Address, token: Address) {
        user.require_auth();

        let blog_client = BloggingPlatformClient::new(&env, &blog_contract);
        let post = blog_client.get_post(&post_id).unwrap();

        if post.is_paid {
            let token_client = crate::token::RsTokenContractClient::new(&env, &token);
            token_client.transfer(&user, &post.author, &0, &post.price);
            
            // Note: In a real app, we would store access in a separate contract or this one
            // For now, we emit an event that the frontend can use
            env.events().publish(
                (Symbol::new(&env, "access_purchased"), user),
                (post_id, post.author),
            );
        }
    }

    pub fn subscribe(env: Env, subscriber: Address, creator: Address, token: Address, amount: i128, duration: u64) {
        subscriber.require_auth();

        let token_client = crate::token::RsTokenContractClient::new(&env, &token);
        token_client.transfer(&subscriber, &creator, &0, &amount);

        let expiry = env.ledger().timestamp() + duration;
        env.storage().persistent().set(&DataKey::Subscriptions(subscriber.clone(), creator.clone()), &expiry);

        env.events().publish(
            (Symbol::new(&env, "subscription_created"), subscriber),
            (creator, expiry),
        );
    }

    pub fn get_earnings(env: Env, creator: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Earnings(creator)).unwrap_or(0)
    }
}
