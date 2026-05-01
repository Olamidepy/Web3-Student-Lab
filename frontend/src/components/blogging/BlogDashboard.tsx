'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, 
  BookOpen, 
  DollarSign, 
  MessageSquare, 
  Heart, 
  Share2, 
  TrendingUp, 
  Shield, 
  Lock,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  isPaid: boolean;
  price: string;
  likes: number;
  comments: number;
  tags: string[];
}

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Soroban Smart Contracts",
    excerpt: "Exploring the next generation of WASM-based smart contracts on the Stellar network...",
    author: "StellarDev",
    date: "Oct 24, 2026",
    readTime: "8 min read",
    isPaid: false,
    price: "0",
    likes: 124,
    comments: 18,
    tags: ["WASM", "Stellar", "Rust"]
  },
  {
    id: 2,
    title: "Monetizing Open Source via On-Chain Tips",
    excerpt: "How direct tipping mechanisms are revolutionizing the way developers fund their work...",
    author: "OpenSourceGal",
    date: "Oct 22, 2026",
    readTime: "12 min read",
    isPaid: true,
    price: "50 RST",
    likes: 89,
    comments: 24,
    tags: ["Economics", "Blogging", "Web3"]
  },
  {
    id: 3,
    title: "Advanced Merkle Tree Optimizations",
    excerpt: "Deep dive into gas-efficient merkle proof verification techniques for large-scale distributions...",
    author: "CryptoWizard",
    date: "Oct 20, 2026",
    readTime: "15 min read",
    isPaid: true,
    price: "100 RST",
    likes: 245,
    comments: 42,
    tags: ["Cryptography", "Performance"]
  }
];

export const BlogDashboard: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'feed' | 'editor' | 'analytics'>('feed');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-red-600 selection:text-white">
      {/* Navigation Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 border-r border-white/5 bg-zinc-950 flex flex-col items-center py-8 gap-10 z-50">
        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <Shield className="w-6 h-6" />
        </div>
        
        <nav className="flex flex-col gap-6">
          <NavIcon icon={<BookOpen />} active={view === 'feed'} onClick={() => setView('feed')} label="Read" />
          <NavIcon icon={<PenTool />} active={view === 'editor'} onClick={() => setView('editor')} label="Write" />
          <NavIcon icon={<TrendingUp />} active={view === 'analytics'} onClick={() => setView('analytics')} label="Stats" />
        </nav>

        <div className="mt-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-zinc-800 border border-white/10"></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-20 min-h-screen">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-12 sticky top-0 bg-black/50 backdrop-blur-xl z-40">
          <h2 className="text-xl font-black uppercase tracking-[0.3em]">
            Protocol <span className="text-red-600">Journal</span>
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black" />
              ))}
              <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center text-[10px] font-bold">
                +42
              </div>
            </div>
            <button className="bg-red-600 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all">
              Connect Wallet
            </button>
          </div>
        </header>

        <div className="p-12 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {view === 'feed' && (
              <motion.div 
                key="feed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Intelligence Feed</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Encrypted decentralized content streams</p>
                  </div>
                  <div className="flex gap-2">
                    {["Trending", "Latest", "Curated"].map(f => (
                      <button key={f} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-full hover:border-red-500 transition-all">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-8">
                  {mockPosts.map((post) => (
                    <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
                  ))}
                </div>
              </motion.div>
            )}

            {view === 'editor' && (
              <motion.div 
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-3xl mx-auto"
              >
                <div className="mb-12 border-l-2 border-red-600 pl-6">
                  <h1 className="text-4xl font-black uppercase tracking-tight mb-2">New Transmission</h1>
                  <p className="text-gray-500 uppercase text-xs tracking-widest">Mint your thoughts to the immutable ledger</p>
                </div>
                
                <div className="space-y-8">
                  <input 
                    type="text" 
                    placeholder="ARTICLE TITLE" 
                    className="w-full bg-transparent border-b border-white/10 py-4 text-3xl font-black focus:border-red-600 outline-none uppercase tracking-tighter transition-all"
                  />
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/10 rounded-md text-[10px] font-bold uppercase">
                      <Plus className="w-3 h-3" /> Add Tag
                    </button>
                    <label className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-white/10 rounded-md cursor-pointer">
                      <input type="checkbox" className="accent-red-600" />
                      <span className="text-[10px] font-bold uppercase">Paid Content</span>
                    </label>
                  </div>
                  <textarea 
                    placeholder="BEGIN TRANSMISSION..." 
                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-8 min-h-[400px] font-mono text-gray-400 focus:border-red-600 outline-none transition-all"
                  />
                  <div className="flex justify-end gap-4">
                    <button className="px-8 py-4 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:border-white transition-all">Save Draft</button>
                    <button className="px-12 py-4 bg-red-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all">Publish to Chain</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex justify-end"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl bg-zinc-950 border-l border-white/10 h-full p-12 overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="mb-12 text-gray-500 hover:text-white flex items-center gap-2 uppercase text-xs font-black tracking-widest transition-all"
              >
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to Feed
              </button>

              {selectedPost.isPaid ? (
                <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-white/5 border-dashed">
                  <Lock className="w-16 h-16 text-red-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-black uppercase mb-4 tracking-tight">Access Restricted</h2>
                  <p className="text-gray-500 max-w-sm mx-auto mb-8 font-light">This intellectual property is protected by a smart contract seal. Unlock to view content.</p>
                  <button className="px-10 py-4 bg-red-600 rounded-xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                    Unlock for {selectedPost.price}
                  </button>
                </div>
              ) : (
                <article className="prose prose-invert max-w-none">
                  <div className="flex gap-2 mb-6">
                    {selectedPost.tags.map(t => (
                      <span key={t} className="px-3 py-1 bg-red-600/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">{selectedPost.title}</h1>
                  <div className="flex items-center gap-4 text-gray-500 text-xs font-bold uppercase tracking-widest mb-12">
                    <span>{selectedPost.author}</span>
                    <span>•</span>
                    <span>{selectedPost.date}</span>
                    <span>•</span>
                    <span>{selectedPost.readTime}</span>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed font-light mb-8 italic">
                    {selectedPost.excerpt}
                  </p>
                  <div className="space-y-6 text-gray-400 font-light leading-loose">
                    <p>Soroban represents a fundamental shift in how we think about smart contract execution on public ledgers. By leveraging WebAssembly (WASM), it provides a high-performance environment that is both gas-efficient and developer-friendly.</p>
                    <p>Unlike EVM-based chains, Soroban's resource management is explicit, allowing for predictable costs and sub-second confirmation times. This makes it the ideal platform for building complex dApps like this decentralized journaling protocol.</p>
                  </div>
                  
                  <div className="mt-20 pt-12 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-6">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" /> <span className="text-xs font-bold">{selectedPost.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <MessageSquare className="w-5 h-5" /> <span className="text-xs font-bold">{selectedPost.comments}</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 transition-all group">
                      <DollarSign className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" /> Send Tip
                    </button>
                  </div>
                </article>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  ChatBubbleLeftIcon, 
  HeartIcon, 
  CurrencyDollarIcon, 
  UserCircleIcon,
  ClockIcon,
  ChevronRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  timestamp: string;
  views: number;
  likes: number;
  comments: number;
  price?: number;
  isPaid: boolean;
}

const BlogDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', price: 0, isPaid: false });
  const [userEarnings, setUserEarnings] = useState({ tips: 0, sales: 0, subs: 0 });

  // Dummy data for initial render
  useEffect(() => {
    const dummyPosts: Post[] = [
      {
        id: 1,
        author: 'GB...XYZ',
        title: 'The Future of Decentralized Content',
        content: 'Blockchain technology is revolutionizing how we create and monetize content...',
        timestamp: '2 hours ago',
        views: 1250,
        likes: 45,
        comments: 12,
        isPaid: false
      },
      {
        id: 2,
        author: 'GA...ABC',
        title: 'Mastering Soroban Smart Contracts',
        content: 'Learn how to build scalable dApps on the Stellar network using Rust...',
        timestamp: '5 hours ago',
        views: 890,
        likes: 32,
        comments: 8,
        price: 5,
        isPaid: true
      }
    ];
    setPosts(dummyPosts);
    setUserEarnings({ tips: 120, sales: 450, subs: 25 });
  }, []);

  const handleCreatePost = () => {
    // Logic to call contract create_post
    console.log('Creating post:', newPost);
    setIsCreating(false);
  };

  const handleTip = (postId: number) => {
    // Logic to call contract tip_creator
    console.log('Tipping for post:', postId);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Decentralized Blogging
            </h1>
            <p className="text-slate-400 mt-2">Own your content. Earn from your passion.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-900/40"
          >
            <PlusIcon className="w-5 h-5" />
            Create Post
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <main className="lg:col-span-2 space-y-6">
            <div className="flex gap-4 mb-6 text-sm font-medium">
              <button className="px-4 py-2 bg-indigo-600 rounded-full">Latest</button>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">Trending</button>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">Following</button>
            </div>

            {posts.map(post => (
              <article key={post.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
                      {post.author.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{post.author}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" /> {post.timestamp}
                      </p>
                    </div>
                  </div>
                  {post.isPaid && (
                    <span className="bg-amber-500/10 text-amber-500 text-[10px] uppercase font-black px-2 py-1 rounded border border-amber-500/20">
                      Paid Access
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold mb-3 group-hover:translate-x-1 transition-transform">{post.title}</h2>
                <p className="text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors">
                      <HeartIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors">
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                    <button 
                      onClick={() => handleTip(post.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-green-400 transition-colors"
                    >
                      <CurrencyDollarIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Tip</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-indigo-400 font-bold text-sm hover:underline">
                    Read More <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </main>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Creator Dashboard */}
            <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <ChartBarIcon className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-bold">Creator Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800/40 rounded-xl">
                  <span className="text-slate-400 text-sm">Total Tips</span>
                  <span className="text-green-400 font-mono font-bold">${userEarnings.tips}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/40 rounded-xl">
                  <span className="text-slate-400 text-sm">Article Sales</span>
                  <span className="text-blue-400 font-mono font-bold">${userEarnings.sales}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/40 rounded-xl">
                  <span className="text-slate-400 text-sm">Subscriptions</span>
                  <span className="text-purple-400 font-mono font-bold">{userEarnings.subs}</span>
                </div>
                
                {/* Transparency Metric */}
                <div className="pt-4 border-t border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Earnings Breakdown</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/60 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-500">This Week</p>
                      <p className="text-sm font-bold text-slate-200">+$125.40</p>
                    </div>
                    <div className="bg-slate-800/60 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-500">Projected</p>
                      <p className="text-sm font-bold text-indigo-400">+$540.00</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold text-sm transition-colors border border-slate-700">
                View Detailed Analytics
              </button>
            </div>

            {/* Trending Tags */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {['#web3', '#soroban', '#stellar', '#rust', '#dapps', '#future'].map(tag => (
                  <span key={tag} className="bg-slate-800 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-indigo-400 cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Create Post Modal (Simplified) */}
        {isCreating && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Create New Article</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Article Title"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 focus:outline-none focus:border-indigo-500"
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
                <textarea 
                  placeholder="Write your content here..."
                  className="w-full h-48 bg-slate-800 border border-slate-700 rounded-xl p-4 focus:outline-none focus:border-indigo-500 resize-none"
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                      onChange={(e) => setNewPost({...newPost, isPaid: e.target.checked})}
                    />
                    <span className="text-sm font-medium">Set as Paid Content</span>
                  </label>
                  {newPost.isPaid && (
                    <input 
                      type="number" 
                      placeholder="Price (XLM)"
                      className="w-32 bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-500"
                      onChange={(e) => setNewPost({...newPost, price: parseFloat(e.target.value)})}
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreatePost}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-900/40"
                >
                  Publish Article
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NavIcon: React.FC<{ icon: React.ReactNode, active: boolean, onClick: () => void, label: string }> = ({ icon, active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all relative group ${active ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white hover:bg-zinc-900'}`}
  >
    {icon}
    <span className={`absolute left-16 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest pointer-events-none whitespace-nowrap`}>
      {label}
    </span>
  </button>
);

const PostCard: React.FC<{ post: BlogPost, onClick: () => void }> = ({ post, onClick }) => (
  <motion.div 
    whileHover={{ x: 10 }}
    onClick={onClick}
    className="group bg-zinc-950 border border-white/5 p-8 rounded-3xl cursor-pointer hover:border-red-600/30 transition-all relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-2">
        {post.tags.map(t => (
          <span key={t} className="text-[9px] font-black uppercase tracking-widest text-gray-500">{t}</span>
        ))}
      </div>
      {post.isPaid && (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
          <Lock className="w-2.5 h-2.5" /> Premium Content
        </span>
      )}
    </div>

    <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 group-hover:text-red-500 transition-colors leading-none">{post.title}</h3>
    <p className="text-gray-500 text-sm font-light mb-6 line-clamp-2 italic">{post.excerpt}</p>
    
    <div className="flex items-center justify-between pt-6 border-t border-white/5">
      <div className="flex items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
        <span>{post.author}</span>
        <span>•</span>
        <span>{post.readTime}</span>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Heart className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">{post.likes}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <MessageSquare className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">{post.comments}</span>
        </div>
      </div>
    </div>
  </motion.div>
);
export default BlogDashboard;
