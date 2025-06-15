from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from typing import Optional, List
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GoTech Solutions API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client.gotech_solutions

# Collections
contacts_collection = db.contacts
blog_posts_collection = db.blog_posts
comments_collection = db.comments
users_collection = db.users

# Pydantic models
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str
    service: Optional[str] = None

class BlogPost(BaseModel):
    title: str
    content: str
    excerpt: str
    author: str = "Geoffrey Okoli"
    tags: List[str] = []

class Comment(BaseModel):
    post_id: str
    author_name: str
    content: str
    email: Optional[EmailStr] = None

class User(BaseModel):
    name: str
    email: EmailStr
    password: str

# Email configuration (you'll need to set these environment variables)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = "geoffreyokoliolukaka@gmail.com"
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', '')

def send_email(to_email: str, subject: str, body: str):
    """Send email notification"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_ADDRESS, to_email, text)
        server.quit()
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

@app.get("/")
def read_root():
    return {"message": "GoTech Solutions API", "version": "1.0.0"}

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Service unhealthy")

@app.post("/api/contact")
def submit_contact_form(contact: ContactForm):
    """Submit contact form"""
    try:
        # Create contact document
        contact_doc = {
            "id": str(uuid.uuid4()),
            "name": contact.name,
            "email": contact.email,
            "company": contact.company,
            "message": contact.message,
            "service": contact.service,
            "submitted_at": datetime.utcnow().isoformat(),
            "status": "new"
        }
        
        # Save to database
        result = contacts_collection.insert_one(contact_doc)
        logger.info(f"Contact form submitted: {contact_doc['id']}")
        
        # Send notification email to Geoffrey
        email_subject = f"New Contact Form Submission - {contact.service or 'General Inquiry'}"
        email_body = f"""
New contact form submission received:

Name: {contact.name}
Email: {contact.email}
Company: {contact.company or 'Not provided'}
Service: {contact.service or 'Not specified'}

Message:
{contact.message}

Submitted at: {contact_doc['submitted_at']}
Contact ID: {contact_doc['id']}
        """
        
        # Send email (if email credentials are configured)
        if EMAIL_PASSWORD:
            send_email(EMAIL_ADDRESS, email_subject, email_body)
        
        return {"message": "Contact form submitted successfully", "id": contact_doc['id']}
        
    except Exception as e:
        logger.error(f"Error submitting contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

@app.get("/api/contacts")
def get_contacts(skip: int = 0, limit: int = 50):
    """Get contact form submissions (admin endpoint)"""
    try:
        contacts = list(contacts_collection.find(
            {},
            {"_id": 0}
        ).skip(skip).limit(limit).sort("submitted_at", -1))
        
        total = contacts_collection.count_documents({})
        
        return {
            "contacts": contacts,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        logger.error(f"Error fetching contacts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch contacts")

@app.post("/api/blog/posts")
def create_blog_post(post: BlogPost):
    """Create a new blog post"""
    try:
        post_doc = {
            "id": str(uuid.uuid4()),
            "title": post.title,
            "content": post.content,
            "excerpt": post.excerpt,
            "author": post.author,
            "tags": post.tags,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "published": True,
            "views": 0,
            "likes": 0
        }
        
        result = blog_posts_collection.insert_one(post_doc)
        logger.info(f"Blog post created: {post_doc['id']}")
        
        return {"message": "Blog post created successfully", "id": post_doc['id']}
        
    except Exception as e:
        logger.error(f"Error creating blog post: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create blog post")

@app.get("/api/blog/posts")
def get_blog_posts(published: bool = True, skip: int = 0, limit: int = 10):
    """Get blog posts"""
    try:
        query = {"published": published} if published else {}
        
        posts = list(blog_posts_collection.find(
            query,
            {"_id": 0}
        ).skip(skip).limit(limit).sort("created_at", -1))
        
        total = blog_posts_collection.count_documents(query)
        
        return {
            "posts": posts,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        logger.error(f"Error fetching blog posts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch blog posts")

@app.get("/api/blog/posts/{post_id}")
def get_blog_post(post_id: str):
    """Get a specific blog post"""
    try:
        post = blog_posts_collection.find_one({"id": post_id}, {"_id": 0})
        
        if not post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Increment view count
        blog_posts_collection.update_one(
            {"id": post_id},
            {"$inc": {"views": 1}}
        )
        
        return post
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching blog post: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch blog post")

@app.post("/api/blog/posts/{post_id}/comments")
def create_comment(post_id: str, comment: Comment):
    """Create a comment on a blog post"""
    try:
        # Verify post exists
        post = blog_posts_collection.find_one({"id": post_id})
        if not post:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        comment_doc = {
            "id": str(uuid.uuid4()),
            "post_id": post_id,
            "author_name": comment.author_name,
            "content": comment.content,
            "email": comment.email,
            "created_at": datetime.utcnow().isoformat(),
            "approved": True,  # Auto-approve for now
            "likes": 0
        }
        
        result = comments_collection.insert_one(comment_doc)
        logger.info(f"Comment created: {comment_doc['id']}")
        
        return {"message": "Comment created successfully", "id": comment_doc['id']}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating comment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create comment")

@app.get("/api/blog/posts/{post_id}/comments")
def get_comments(post_id: str, approved: bool = True, skip: int = 0, limit: int = 50):
    """Get comments for a blog post"""
    try:
        query = {"post_id": post_id}
        if approved:
            query["approved"] = True
        
        comments = list(comments_collection.find(
            query,
            {"_id": 0, "email": 0}  # Don't expose email addresses
        ).skip(skip).limit(limit).sort("created_at", -1))
        
        total = comments_collection.count_documents(query)
        
        return {
            "comments": comments,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        logger.error(f"Error fetching comments: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch comments")

@app.post("/api/users/register")
def register_user(user: User):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = users_collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # For now, we're storing passwords in plain text
        # In production, you should hash passwords using bcrypt
        user_doc = {
            "id": str(uuid.uuid4()),
            "name": user.name,
            "email": user.email,
            "password": user.password,  # Should be hashed in production
            "avatar": None,
            "created_at": datetime.utcnow().isoformat(),
            "active": True
        }
        
        result = users_collection.insert_one(user_doc)
        logger.info(f"User registered: {user_doc['id']}")
        
        return {
            "message": "User registered successfully",
            "user_id": user_doc['id'],
            "name": user_doc['name'],
            "email": user_doc['email']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to register user")

@app.get("/api/portfolio/projects")
def get_portfolio_projects(category: Optional[str] = None):
    """Get portfolio projects"""
    # For now, return static data
    # In a real implementation, this would come from the database
    projects = [
        {
            "id": 1,
            "title": "E-commerce Mobile App Redesign",
            "category": "ux-ui",
            "description": "Complete mobile app redesign focusing on user experience and conversion optimization",
            "image": "https://images.pexels.com/photos/6373086/pexels-photo-6373086.jpeg",
            "client": "TechCorp Solutions",
            "technologies": ["Figma", "Adobe XD", "Principle"],
            "year": "2024"
        },
        {
            "id": 2,
            "title": "SaaS Dashboard Interface",
            "category": "ux-ui",
            "description": "Modern dashboard design with intuitive navigation and data visualization",
            "image": "https://images.pexels.com/photos/6612388/pexels-photo-6612388.jpeg",
            "client": "DataFlow Inc",
            "technologies": ["Figma", "React", "D3.js"],
            "year": "2024"
        },
        # Add more projects as needed
    ]
    
    if category and category != 'all':
        projects = [p for p in projects if p['category'] == category]
    
    return {"projects": projects}

@app.get("/api/testimonials")
def get_testimonials():
    """Get client testimonials"""
    # Static testimonials for now
    testimonials = [
        {
            "id": 1,
            "name": "Sarah Johnson",
            "company": "TechCorp Solutions",
            "text": "Geoffrey's UX design transformed our mobile app completely. User engagement increased by 150% after the redesign.",
            "rating": 5,
            "service": "UX/UI Design",
            "date": "2024-01-15"
        },
        {
            "id": 2,
            "name": "Michael Chen",
            "company": "DataFlow Inc",
            "text": "The dashboard design exceeded our expectations. GoTech Solutions delivered exceptional quality on time.",
            "rating": 5,
            "service": "UX/UI Design",
            "date": "2024-01-10"
        },
        {
            "id": 3,
            "name": "Emily Rodriguez",
            "company": "StartupX",
            "text": "The copywriting and brand strategy work was outstanding. Our conversion rates improved significantly.",
            "rating": 5,
            "service": "Copywriting",
            "date": "2024-01-05"
        }
    ]
    
    return {"testimonials": testimonials}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)