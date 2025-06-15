#!/usr/bin/env python3
import requests
import json
import time
import os
import sys
from datetime import datetime

# Get the backend URL from the frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.strip().split('=')[1].strip('"\'')
    except Exception as e:
        print(f"Error reading backend URL from .env file: {e}")
        return None

# Configuration
BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("ERROR: Could not determine backend URL. Exiting.")
    sys.exit(1)

API_BASE_URL = f"{BACKEND_URL}/api"
print(f"Using API base URL: {API_BASE_URL}")

# Test results tracking
test_results = {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "tests": []
}

def run_test(test_name, test_func, *args, **kwargs):
    """Run a test and track results"""
    test_results["total"] += 1
    print(f"\n{'='*80}\nTEST: {test_name}\n{'='*80}")
    
    start_time = time.time()
    try:
        result = test_func(*args, **kwargs)
        duration = time.time() - start_time
        
        if result:
            test_results["passed"] += 1
            status = "PASSED"
        else:
            test_results["failed"] += 1
            status = "FAILED"
            
        test_results["tests"].append({
            "name": test_name,
            "status": status,
            "duration": duration
        })
        
        print(f"\nRESULT: {status} (Duration: {duration:.2f}s)")
        return result
    except Exception as e:
        duration = time.time() - start_time
        test_results["failed"] += 1
        test_results["tests"].append({
            "name": test_name,
            "status": "ERROR",
            "duration": duration,
            "error": str(e)
        })
        print(f"\nERROR: {str(e)}")
        print(f"\nRESULT: ERROR (Duration: {duration:.2f}s)")
        return False

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check endpoint...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and response.json().get("status") == "healthy":
            print("✅ Health check successful - Database is connected")
            return True
        else:
            print("❌ Health check failed")
            return False
    except Exception as e:
        print(f"❌ Error during health check: {e}")
        return False

def test_contact_form_full():
    """Test contact form submission with all fields"""
    print("Testing contact form submission with all fields...")
    
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "company": "Test Company",
        "service": "UX/UI Design",
        "message": "This is a test message with all fields filled out."
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/contact", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and "id" in response.json():
            print("✅ Contact form submission successful")
            return True
        else:
            print("❌ Contact form submission failed")
            return False
    except Exception as e:
        print(f"❌ Error during contact form submission: {e}")
        return False

def test_contact_form_minimal():
    """Test contact form submission with minimal fields"""
    print("Testing contact form submission with minimal fields...")
    
    data = {
        "name": "Minimal User",
        "email": "minimal@example.com",
        "message": "This is a test message with minimal fields."
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/contact", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and "id" in response.json():
            print("✅ Minimal contact form submission successful")
            return True
        else:
            print("❌ Minimal contact form submission failed")
            return False
    except Exception as e:
        print(f"❌ Error during minimal contact form submission: {e}")
        return False

def test_blog_post_creation():
    """Test blog post creation"""
    print("Testing blog post creation...")
    
    data = {
        "title": "Test Blog Post",
        "content": "This is a test blog post content with detailed information about design principles.",
        "excerpt": "A brief summary of the test blog post.",
        "author": "Test Author",
        "tags": ["design", "test", "api"]
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/blog/posts", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and "id" in response.json():
            print("✅ Blog post creation successful")
            # Store the blog post ID for later tests
            blog_post_id = response.json()["id"]
            return blog_post_id
        else:
            print("❌ Blog post creation failed")
            return False
    except Exception as e:
        print(f"❌ Error during blog post creation: {e}")
        return False

def test_blog_posts_retrieval():
    """Test blog posts retrieval"""
    print("Testing blog posts retrieval...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/blog/posts")
        print(f"Status Code: {response.status_code}")
        print(f"Response structure: {list(response.json().keys())}")
        print(f"Total posts: {response.json().get('total', 0)}")
        
        if response.status_code == 200 and "posts" in response.json():
            posts = response.json()["posts"]
            print(f"Retrieved {len(posts)} blog posts")
            if len(posts) > 0:
                print(f"First post title: {posts[0].get('title')}")
            return True
        else:
            print("❌ Blog posts retrieval failed")
            return False
    except Exception as e:
        print(f"❌ Error during blog posts retrieval: {e}")
        return False

def test_blog_post_detail(post_id):
    """Test blog post detail retrieval"""
    if not post_id:
        print("❌ No blog post ID provided, skipping test")
        return False
        
    print(f"Testing blog post detail retrieval for ID: {post_id}...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/blog/posts/{post_id}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200 and "title" in response.json():
            print("✅ Blog post detail retrieval successful")
            return True
        else:
            print("❌ Blog post detail retrieval failed")
            return False
    except Exception as e:
        print(f"❌ Error during blog post detail retrieval: {e}")
        return False

def test_blog_comment_creation(post_id):
    """Test blog comment creation"""
    if not post_id:
        print("❌ No blog post ID provided, skipping test")
        return False
        
    print(f"Testing blog comment creation for post ID: {post_id}...")
    
    data = {
        "post_id": post_id,
        "author_name": "Test Commenter",
        "content": "This is a test comment on the blog post.",
        "email": "commenter@example.com"
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/blog/posts/{post_id}/comments", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and "id" in response.json():
            print("✅ Blog comment creation successful")
            return response.json()["id"]
        else:
            print("❌ Blog comment creation failed")
            return False
    except Exception as e:
        print(f"❌ Error during blog comment creation: {e}")
        return False

def test_blog_comments_retrieval(post_id):
    """Test blog comments retrieval"""
    if not post_id:
        print("❌ No blog post ID provided, skipping test")
        return False
        
    print(f"Testing blog comments retrieval for post ID: {post_id}...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/blog/posts/{post_id}/comments")
        print(f"Status Code: {response.status_code}")
        print(f"Response structure: {list(response.json().keys())}")
        print(f"Total comments: {response.json().get('total', 0)}")
        
        if response.status_code == 200 and "comments" in response.json():
            comments = response.json()["comments"]
            print(f"Retrieved {len(comments)} comments")
            if len(comments) > 0:
                print(f"First comment author: {comments[0].get('author_name')}")
            return True
        else:
            print("❌ Blog comments retrieval failed")
            return False
    except Exception as e:
        print(f"❌ Error during blog comments retrieval: {e}")
        return False

def test_portfolio_projects():
    """Test portfolio projects retrieval"""
    print("Testing portfolio projects retrieval...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/portfolio/projects")
        print(f"Status Code: {response.status_code}")
        print(f"Response structure: {list(response.json().keys())}")
        
        if response.status_code == 200 and "projects" in response.json():
            projects = response.json()["projects"]
            print(f"Retrieved {len(projects)} portfolio projects")
            if len(projects) > 0:
                print(f"First project title: {projects[0].get('title')}")
            return True
        else:
            print("❌ Portfolio projects retrieval failed")
            return False
    except Exception as e:
        print(f"❌ Error during portfolio projects retrieval: {e}")
        return False

def test_portfolio_projects_filtered():
    """Test portfolio projects retrieval with category filter"""
    print("Testing portfolio projects retrieval with category filter...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/portfolio/projects?category=ux-ui")
        print(f"Status Code: {response.status_code}")
        print(f"Response structure: {list(response.json().keys())}")
        
        if response.status_code == 200 and "projects" in response.json():
            projects = response.json()["projects"]
            print(f"Retrieved {len(projects)} filtered portfolio projects")
            
            # Verify all projects are in the ux-ui category
            all_match = all(project.get('category') == 'ux-ui' for project in projects)
            
            if all_match:
                print("✅ All projects match the requested category")
                return True
            else:
                print("❌ Some projects don't match the requested category")
                return False
        else:
            print("❌ Filtered portfolio projects retrieval failed")
            return False
    except Exception as e:
        print(f"❌ Error during filtered portfolio projects retrieval: {e}")
        return False

def test_testimonials():
    """Test testimonials retrieval"""
    print("Testing testimonials retrieval...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/testimonials")
        print(f"Status Code: {response.status_code}")
        print(f"Response structure: {list(response.json().keys())}")
        
        if response.status_code == 200 and "testimonials" in response.json():
            testimonials = response.json()["testimonials"]
            print(f"Retrieved {len(testimonials)} testimonials")
            if len(testimonials) > 0:
                print(f"First testimonial name: {testimonials[0].get('name')}")
            return True
        else:
            print("❌ Testimonials retrieval failed")
            return False
    except Exception as e:
        print(f"❌ Error during testimonials retrieval: {e}")
        return False

def test_user_registration():
    """Test user registration"""
    print("Testing user registration...")
    
    # Generate a unique email to avoid conflicts
    timestamp = int(time.time())
    data = {
        "name": "Test User",
        "email": f"testuser{timestamp}@example.com",
        "password": "securepassword123"
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/users/register", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and "user_id" in response.json():
            print("✅ User registration successful")
            return True
        else:
            print("❌ User registration failed")
            return False
    except Exception as e:
        print(f"❌ Error during user registration: {e}")
        return False

def print_summary():
    """Print test summary"""
    print(f"\n{'='*80}")
    print(f"TEST SUMMARY")
    print(f"{'='*80}")
    print(f"Total tests: {test_results['total']}")
    print(f"Passed: {test_results['passed']}")
    print(f"Failed: {test_results['failed']}")
    print(f"Success rate: {(test_results['passed'] / test_results['total'] * 100) if test_results['total'] > 0 else 0:.2f}%")
    print(f"\nDetailed Results:")
    
    for test in test_results["tests"]:
        status_symbol = "✅" if test["status"] == "PASSED" else "❌"
        print(f"{status_symbol} {test['name']} - {test['status']} ({test['duration']:.2f}s)")
        if test.get("error"):
            print(f"   Error: {test['error']}")
    
    print(f"\nTest completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    print(f"Starting GoTech Solutions Backend API Tests")
    print(f"{'='*80}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}")
    
    # Run tests in order of priority
    
    # High Priority Tests
    run_test("Health Check", test_health_check)
    run_test("Contact Form (Full)", test_contact_form_full)
    run_test("Contact Form (Minimal)", test_contact_form_minimal)
    
    # Medium Priority Tests
    blog_post_id = run_test("Blog Post Creation", test_blog_post_creation)
    run_test("Blog Posts Retrieval", test_blog_posts_retrieval)
    
    if blog_post_id:
        run_test("Blog Post Detail", test_blog_post_detail, blog_post_id)
        comment_id = run_test("Blog Comment Creation", test_blog_comment_creation, blog_post_id)
        run_test("Blog Comments Retrieval", test_blog_comments_retrieval, blog_post_id)
    
    run_test("Portfolio Projects", test_portfolio_projects)
    run_test("Portfolio Projects (Filtered)", test_portfolio_projects_filtered)
    run_test("Testimonials", test_testimonials)
    run_test("User Registration", test_user_registration)
    
    # Print summary
    print_summary()