import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";
import "../styles/CommunityPage.css";

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newComments, setNewComments] = useState({}); // Use an object to track comments per post

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "communityPosts"), (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const handleAddPost = async () => {
    if (newPost.trim()) {
      try {
        await addDoc(collection(db, "communityPosts"), {
          text: newPost,
          comments: [],
          createdBy: auth.currentUser?.uid,
          createdAt: new Date(),
        });
        setNewPost("");
      } catch (error) {
        console.error("Error adding post: ", error);
      }
    }
  };
  
  const handleAddComment = async (postId) => {
    const commentText = newComments[postId];
    if (commentText?.trim() && auth.currentUser) {
      try {
        const postRef = doc(db, "communityPosts", postId);
        const post = posts.find((post) => post.id === postId);
        const updatedComments = [
          ...post.comments,
          { text: commentText, createdBy: auth.currentUser.uid },
        ];
  
        await updateDoc(postRef, { comments: updatedComments });
        setNewComments({ ...newComments, [postId]: "" });
      } catch (error) {
        console.error("Error adding comment: ", error);
      }
    }
  };
  

  return (
    <div className="community-container">
      <h1>Community Discussions</h1>
      
      <div className="new-post">
        <textarea
          placeholder="Start a discussion..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handleAddPost}>Post</button>
      </div>

      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post">
            <p><strong>{post.createdBy}</strong>: {post.text}</p>
            
            <div className="comments">
              {post.comments.map((comment, index) => (
                <p key={index}><strong>{comment.createdBy}</strong>: {comment.text}</p>
              ))}
            </div>

            <div className="new-comment">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComments[post.id] || ""}
                onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}
              />
              <button onClick={() => handleAddComment(post.id)}>Comment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityPage;
