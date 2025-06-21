import React, { useState, useEffect } from 'react';

const ChildrensAuthorWebsite = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    // Create sparkles periodically
    const createSparkle = () => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * window.innerWidth + 'px';
      sparkle.style.top = Math.random() * window.innerHeight + 'px';
      document.body.appendChild(sparkle);
      
      setTimeout(() => {
        sparkle.remove();
      }, 3000);
    };

    const sparkleInterval = setInterval(createSparkle, 2000);

    return () => {
      observer.disconnect();
      clearInterval(sparkleInterval);
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all fields! ✨');
      return;
    }
    
    alert('Thank you for your magical message! I\'ll get back to you soon! 🌟');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const smoothScroll = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 overflow-x-hidden">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Fredoka+One:wght@400&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
        }

        .glass-bg {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 15s infinite linear;
          backdrop-filter: blur(10px);
        }

        .floating-shape:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-shape:nth-child(2) {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 20%;
          animation-delay: -5s;
        }

        .floating-shape:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 30%;
          left: 30%;
          animation-delay: -10s;
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(30px) rotate(240deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }

        .logo-gradient {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));
        }

        .hero-title {
          font-family: 'Fredoka One', cursive;
          background: linear-gradient(45deg, #fff, #f8f9fa, #fff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
          animation: slideInLeft 1s ease;
        }

        .section-title {
          font-family: 'Fredoka One', cursive;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .floating-book {
          animation: floatBook 4s ease-in-out infinite;
        }

        .floating-book:nth-child(1) { animation-delay: 0s; }
        .floating-book:nth-child(2) { animation-delay: -1s; }
        .floating-book:nth-child(3) { animation-delay: -2s; }

        @keyframes floatBook {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-20px) rotateY(10deg); }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .sparkle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, #fff 0%, transparent 70%);
          border-radius: 50%;
          animation: sparkle 3s infinite;
          pointer-events: none;
          z-index: 1000;
        }

        @keyframes sparkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1) rotate(180deg); 
          }
        }

        .author-photo::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(transparent, rgba(255,255,255,0.3), transparent);
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }

        .book-cover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }

        .book-card:hover .book-cover::before {
          left: 100%;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          transition: left 0.3s ease;
          z-index: -1;
        }

        .nav-link:hover::before {
          left: 0;
        }
      `}</style>

      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-40 transition-all duration-300 py-4 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'glass-bg'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <button 
            onClick={() => smoothScroll('home')}
            className="text-2xl font-bold logo-gradient hover:scale-105 transition-transform duration-300"
            style={{ fontFamily: 'Fredoka One, cursive' }}
          >
            ✨ Emma Stories
          </button>
          <div className="hidden md:flex space-x-4">
            {[
              { id: 'home', label: '🏠 Home' },
              { id: 'books', label: '📚 Books' },
              { id: 'about', label: '👩‍💻 About' },
              { id: 'contact', label: '📧 Contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => smoothScroll(item.id)}
                className="nav-link relative px-6 py-3 text-white font-medium rounded-full glass-bg hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="flex-1 text-left">
              <h1 className="hero-title text-4xl lg:text-6xl font-bold mb-6">
                Welcome to Emma's Magical Universe! ✨
              </h1>
              <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed">
                Where imagination soars, dreams come alive, and every story is a new adventure waiting to unfold. 
                Join thousands of young readers on magical journeys!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => smoothScroll('books')}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-full hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  📖 Explore My Books
                </button>
                <button
                  onClick={() => smoothScroll('about')}
                  className="px-8 py-4 glass-bg text-white font-semibold rounded-full hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                >
                  🌟 Meet Emma
                </button>
              </div>
            </div>
            <div className="flex-1 relative h-96">
              <div className="floating-book absolute top-12 left-12 w-24 h-32 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-2xl shadow-xl flex items-center justify-center text-3xl">
                📚
              </div>
              <div className="floating-book absolute top-24 right-24 w-24 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl shadow-xl flex items-center justify-center text-3xl">
                🌈
              </div>
              <div className="floating-book absolute bottom-20 left-32 w-24 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl shadow-xl flex items-center justify-center text-3xl">
                ⭐
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white rounded-t-[3rem] mt-16 shadow-2xl relative">
        {/* Books Section */}
        <section id="books" className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="section-title text-4xl lg:text-5xl font-bold text-center mb-16 relative">
              ✨ My Magical Books
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-4"></div>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'The Rainbow Adventure',
                  emoji: '🌈',
                  gradient: 'from-pink-400 to-yellow-400',
                  description: 'Join Lily as she discovers the secret behind the magical rainbow that appears in her backyard every morning, leading to a world of wonder and friendship.'
                },
                {
                  title: 'Whiskers and Wonder',
                  emoji: '🐱',
                  gradient: 'from-blue-400 to-cyan-400',
                  description: 'A heartwarming tale about a curious kitten who learns the importance of friendship, kindness, and believing in yourself through magical adventures.'
                },
                {
                  title: 'The Secret Garden Club',
                  emoji: '🌸',
                  gradient: 'from-green-400 to-pink-400',
                  description: 'Four friends discover an enchanted garden where plants can talk, flowers sing beautiful melodies, and every day brings a new magical surprise.'
                }
              ].map((book, index) => (
                <div
                  key={index}
                  className="book-card fade-in-up bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:scale-105 border border-gray-100 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className={`book-cover relative w-36 h-48 bg-gradient-to-br ${book.gradient} rounded-2xl mx-auto mb-8 flex items-center justify-center text-4xl shadow-lg overflow-hidden group-hover:rotate-y-12 transition-transform duration-300`}>
                    {book.emoji}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Fredoka One, cursive' }}>
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {book.description}
                  </p>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold rounded-full hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                    📖 Read More
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16" style={{ fontFamily: 'Fredoka One, cursive' }}>
              🌟 Meet Emma
            </h2>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-center lg:text-left">
                <div className="author-photo relative w-64 h-64 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full mx-auto lg:mx-0 flex items-center justify-center text-6xl shadow-2xl overflow-hidden">
                  👩‍💻
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed opacity-95">
                  Hello, wonderful readers! I'm Emma, and I believe that every child deserves to experience the pure magic of storytelling. 
                  For over a decade, I've been crafting tales that spark imagination and teach valuable life lessons.
                </p>
                <p className="text-lg leading-relaxed opacity-95">
                  My journey began when I watched my own children's faces light up during bedtime stories. That magical moment when their eyes sparkle with wonder? 
                  That's what I live for, and what I pour into every single story I write.
                </p>
                <p className="text-lg leading-relaxed opacity-95">
                  When I'm not writing, you'll find me visiting schools, libraries, and bookstores, sharing the joy of reading with young minds and encouraging them to create their own magical worlds.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {[
                { number: '15+', label: 'Published Books' },
                { number: '50K+', label: 'Happy Readers' },
                { number: '100+', label: 'School Visits' },
                { number: '12', label: 'Awards Won' }
              ].map((stat, index) => (
                <div key={index} className="text-center glass-bg rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300">
                  <div className="text-3xl font-bold mb-2" style={{ fontFamily: 'Fredoka One, cursive' }}>
                    {stat.number}
                  </div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16" style={{ fontFamily: 'Fredoka One, cursive' }}>
              💌 Let's Connect!
            </h2>
           placeholder="your.email@example.com"
                    className="w-full px-4 py-3 glass-bg rounded-2xl text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Subject 🎯</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  className="w-full px-4 py-3 glass-bg rounded-2xl text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div className="mb-8">
                <label className="block text-white font-medium mb-2">Your Message 💭</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me your story..."
                  rows="5"
                  className="w-full px-4 py-3 glass-bg rounded-2xl text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-full hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🚀 Send My Message
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Fredoka One, cursive' }}>
                  Emma Stories
                </h3>
                <p className="text-gray-300">Creating magical worlds where imagination knows no bounds.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Quick Links</h3>
                <div className="space-y-2">
                  {['Home', 'Books', 'About', 'Contact'].map((link) => (
                    <button
                      key={link}
                      onClick={() => smoothScroll(link.toLowerCase())}
                      className="block text-gray-300 hover:text-white transition-colors"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Connect</h3>
                <div className="flex space-x-4">
                  {['📘', '📷', '🐦', '✉️'].map((icon, index) => (
                    <button
                      key={index}
                      className="w-12 h-12 glass-bg rounded-full flex items-center justify-center text-xl hover:-translate-y-1 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Emma Stories. All rights reserved. Made with ✨ and lots of imagination!</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChildrensAuthorWebsite;