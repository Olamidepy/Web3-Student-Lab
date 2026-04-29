use soroban_sdk::{
    contract, contractimpl, contracttype, Address, BytesN, Env, String, Vec, Symbol,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Post {
    pub id: u64,
    pub author: Address,
    pub content_hash: BytesN<32>,
    pub timestamp: u64,
    pub price: i128,
    pub is_paid: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Comment {
    pub author: Address,
    pub text_hash: BytesN<32>,
    pub timestamp: u64,
}

#[contracttype]
enum DataKey {
    PostCount,
    Posts(u64),
    Comments(u64),
    Reactions(u64, Symbol), // (post_id, reaction_type) -> count
    HasAccess(Address, u64), // (user, post_id) -> bool
}

#[contract]
pub struct BloggingPlatform;

#[contractimpl]
impl BloggingPlatform {
    pub fn create_post(env: Env, author: Address, content_hash: BytesN<32>, price: i128) -> u64 {
        author.require_auth();

        let mut count: u64 = env.storage().instance().get(&DataKey::PostCount).unwrap_or(0);
        count += 1;

        let post = Post {
            id: count,
            author: author.clone(),
            content_hash,
            timestamp: env.ledger().timestamp(),
            price,
            is_paid: price > 0,
        };

        env.storage().persistent().set(&DataKey::Posts(count), &post);
        env.storage().instance().set(&DataKey::PostCount, &count);

        env.events().publish(
            (Symbol::new(&env, "post_created"), author),
            (count, content_hash),
        );

        count
    }

    pub fn get_post(env: Env, post_id: u64) -> Option<Post> {
        env.storage().persistent().get(&DataKey::Posts(post_id))
    }

    pub fn add_comment(env: Env, author: Address, post_id: u64, text_hash: BytesN<32>) {
        author.require_auth();

        let mut comments: Vec<Comment> = env
            .storage()
            .persistent()
            .get(&DataKey::Comments(post_id))
            .unwrap_or(Vec::new(&env));

        comments.push_back(Comment {
            author: author.clone(),
            text_hash,
            timestamp: env.ledger().timestamp(),
        });

        env.storage().persistent().set(&DataKey::Comments(post_id), &comments);

        env.events().publish(
            (Symbol::new(&env, "comment_added"), post_id),
            (author, text_hash),
        );
    }

    pub fn react(env: Env, user: Address, post_id: u64, reaction: Symbol) {
        user.require_auth();
        
        let key = DataKey::Reactions(post_id, reaction.clone());
        let mut count: u32 = env.storage().persistent().get(&key).unwrap_or(0);
        count += 1;
        
        env.storage().persistent().set(&key, &count);
        
        env.events().publish(
            (Symbol::new(&env, "post_reaction"), post_id),
            (user, reaction, count),
        );
    }
}
