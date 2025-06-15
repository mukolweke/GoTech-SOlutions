import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [projects] = useState([
    // UX/UI Design Projects
    {
      id: 1,
      title: "E-commerce Mobile App Redesign",
      category: "ux-ui",
      description: "Complete mobile app redesign focusing on user experience and conversion optimization",
      image: "https://images.pexels.com/photos/6373086/pexels-photo-6373086.jpeg",
      client: "TechCorp Solutions"
    },
    {
      id: 2,
      title: "SaaS Dashboard Interface",
      category: "ux-ui",
      description: "Modern dashboard design with intuitive navigation and data visualization",
      image: "https://images.pexels.com/photos/6612388/pexels-photo-6612388.jpeg",
      client: "DataFlow Inc"
    },
    // Graphics for Business
    {
      id: 3,
      title: "Corporate Presentation Design",
      category: "business-graphics",
      description: "Professional presentation template with consistent branding elements",
      image: "https://images.pexels.com/photos/9849933/pexels-photo-9849933.jpeg",
      client: "Business Solutions Ltd"
    },
    {
      id: 4,
      title: "Marketing Brochure Design",
      category: "business-graphics",
      description: "Elegant tri-fold brochure with compelling visual hierarchy",
      image: "https://images.pexels.com/photos/7283202/pexels-photo-7283202.jpeg",
      client: "Marketing Pro Agency"
    },
    // Copywriting & Consulting
    {
      id: 5,
      title: "Website Content Strategy",
      category: "copywriting",
      description: "Complete website copywriting with SEO optimization and conversion focus",
      image: "https://images.unsplash.com/photo-1574583943689-b71046e8773e",
      client: "StartupX"
    },
    {
      id: 6,
      title: "Business Consultation Report",
      category: "copywriting",
      description: "Comprehensive business analysis and strategic recommendations",
      image: "https://images.unsplash.com/photo-1661956600684-97d3a4320e45",
      client: "Growth Partners"
    },
    // CV & Resume Design
    {
      id: 7,
      title: "Executive Resume Design", 
      category: "cv-resume",
      description: "Premium resume design for C-level executives with modern layout",
      image: "https://images.unsplash.com/photo-1490013616775-3ca8865fb129",
      client: "Executive Search Firm"
    },
    {
      id: 8,
      title: "Creative Portfolio Design",
      category: "cv-resume", 
      description: "Creative professional portfolio with interactive elements",
      image: "https://images.pexels.com/photos/7191982/pexels-photo-7191982.jpeg",
      client: "Creative Agency"
    },
    // Branding & Logo Design
    {
      id: 9,
      title: "Complete Brand Identity",
      category: "branding",
      description: "Full brand identity package with logo, colors, and brand guidelines",
      image: "https://images.pexels.com/photos/7661590/pexels-photo-7661590.jpeg",
      client: "InnovateTech"
    },
    {
      id: 10,
      title: "Digital Brand Guidelines",
      category: "branding",
      description: "Comprehensive digital brand guidelines and asset library",
      image: "https://images.pexels.com/photos/7661643/pexels-photo-7661643.jpeg",
      client: "DigitalFirst Corp"
    }
  ]);

  const [testimonials] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechCorp Solutions",
      text: "Geoffrey's UX design transformed our mobile app completely. User engagement increased by 150% after the redesign.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "DataFlow Inc",
      text: "The dashboard design exceeded our expectations. GoTech Solutions delivered exceptional quality on time.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "StartupX",
      text: "The copywriting and brand strategy work was outstanding. Our conversion rates improved significantly.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ]);

  const [blogPosts] = useState([
    {
      id: 1,
      title: "The Future of UX Design in 2024",
      excerpt: "Exploring emerging trends and technologies shaping user experience design.",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=250&fit=crop"
    },
    {
      id: 2, 
      title: "Building Brand Identity That Converts",
      excerpt: "How strategic branding drives business growth and customer loyalty.",
      date: "2024-01-10",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Copywriting Secrets for Better Conversions",
      excerpt: "Proven copywriting techniques that turn visitors into customers.",
      date: "2024-01-05", 
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop"
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    service: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'ux-ui', name: 'UX/UI Design' },
    { id: 'business-graphics', name: 'Business Graphics' },
    { id: 'copywriting', name: 'Copywriting & Consulting' },
    { id: 'cv-resume', name: 'CV & Resume' },
    { id: 'branding', name: 'Branding & Logo' }
  ];

  const services = [
    {
      title: "UX/UI Design",
      description: "User-centered design solutions that drive engagement and conversions",
      icon: "🎨",
      features: ["User Research", "Wireframing", "Prototyping", "Usability Testing"]
    },
    {
      title: "Business Graphics",
      description: "Professional presentations, reports, flyers, and brochures",
      icon: "📊",
      features: ["Presentations", "Reports", "Flyers", "Brochures"]
    },
    {
      title: "Copywriting & Consulting",
      description: "Strategic content and business consultation services",
      icon: "✍️",
      features: ["Website Copy", "Content Strategy", "Business Analysis", "Marketing Copy"]
    },
    {
      title: "CV & Resume Design",
      description: "Professional resume and pitch deck design",
      icon: "📄",
      features: ["Resume Design", "CV Templates", "Pitch Decks", "Portfolio Design"]
    },
    {
      title: "Branding & Logo Design",
      description: "Complete brand identity and visual design solutions",
      icon: "🎯",
      features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Mockups"]
    },
    {
      title: "Grant Proposal Writing",
      description: "Professional grant proposals and business documentation",
      icon: "📝",
      features: ["Grant Writing", "Proposal Design", "Business Plans", "Documentation"]
    }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        alert('Thank you for your message! We\'ll get back to you soon.');
        setContactForm({
          name: '',
          email: '',
          company: '',
          message: '',
          service: ''
        });
      } else {
        alert('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                GoTech Solutions
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="#portfolio" className="text-gray-700 hover:text-blue-600 transition-colors">Portfolio</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Testimonials</a>
              <a href="#blog" className="text-gray-700 hover:text-blue-600 transition-colors">Blog</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1718220216044-006f43e3a9b1')`
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Bringing Ideas to Life Through 
                <span className="bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent"> Design</span>
              </h1>
              <p className="text-xl mb-4 text-blue-100">
                Hi, I'm <strong>Geoffrey Okoli</strong>, founder of GoTech Solutions
              </p>
              <p className="text-lg mb-8 text-blue-100 max-w-2xl">
                With over 10 years of experience in tech and design, I help businesses and individuals 
                communicate better and grow faster through clean, user-friendly designs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#portfolio" 
                  className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                >
                  View My Work
                </a>
                <a 
                  href="#contact" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors text-center"
                >
                  Get In Touch
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1744686909434-fd158fca1c35" 
                alt="Professional Designer"
                className="rounded-2xl shadow-2xl max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">About GoTech Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Founded in 2023, GoTech Solutions combines technical expertise with creative vision 
              to deliver design solutions that make your ideas clear, smart, and strong.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-900 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Education</h3>
              <p className="text-gray-600">IT at Maseno University & Software Engineering with ALX Africa</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-900 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Experience</h3>
              <p className="text-gray-600">10+ years of experience in tech and design solutions</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-900 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Values</h3>
              <p className="text-gray-600">Trust, honesty, and professionalism in every project</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Services</h2>
            <p className="text-xl text-gray-600">
              Comprehensive design solutions to help your brand communicate better and grow faster
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Portfolio</h2>
            <p className="text-xl text-gray-600 mb-8">
              Showcasing recent projects across different design disciplines
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-600 font-medium">Client: {project.client}</span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">What Clients Say</h2>
            <p className="text-xl text-gray-600">
              Trusted by businesses and individuals worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
                <div className="flex text-yellow-400 mt-4">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Latest Articles</h2>
            <p className="text-xl text-gray-600">
              Insights on design, business growth, and industry trends
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-600">
              Ready to bring your ideas to life? Let's discuss your project.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Let's Work Together</h3>
              <p className="text-gray-600 mb-8">
                Whether you need UX/UI design, branding, or copywriting services, 
                I'm here to help turn your vision into reality.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-xl">📧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                    <p className="text-gray-600">geoffreyokoliolukaka@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-xl">🕒</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Response Time</h4>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Expertise</h4>
                    <p className="text-gray-600">10+ years in design & tech</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={contactForm.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Needed
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={contactForm.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option value="ux-ui">UX/UI Design</option>
                    <option value="business-graphics">Business Graphics</option>
                    <option value="copywriting">Copywriting & Consulting</option>
                    <option value="cv-resume">CV & Resume Design</option>
                    <option value="branding">Branding & Logo Design</option>
                    <option value="grant-writing">Grant Proposal Writing</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-900 to-blue-600 text-white py-4 rounded-lg font-semibold transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-800 hover:to-blue-500'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                GoTech Solutions
              </div>
              <p className="text-gray-400 mb-4">
                Bringing ideas to life through clean, user-friendly designs.
              </p>
              <p className="text-gray-400 text-sm">
                Founded by Geoffrey Okoli - 10+ years of design excellence.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>UX/UI Design</li>
                <li>Business Graphics</li>
                <li>Copywriting</li>
                <li>Branding & Logo</li>
                <li>CV & Resume Design</li>
                <li>Grant Writing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-gray-400 mb-2">geoffreyokoliolukaka@gmail.com</p>
              <p className="text-gray-400 text-sm mb-4">Response within 24 hours</p>
              <div className="text-gray-400 text-sm">
                <p>Trust • Honesty • Professionalism</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GoTech Solutions. All rights reserved. | Founded by Geoffrey Okoli</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;