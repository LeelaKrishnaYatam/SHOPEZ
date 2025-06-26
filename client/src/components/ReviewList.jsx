import React from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/ReviewList.css';

const ReviewList = ({ reviews, currentUserId, onDeleteReview }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDelete = async (reviewId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:6001/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            // Notify parent component to refresh reviews
            if (onDeleteReview) {
                onDeleteReview();
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <div className="review-list-container">
            <h3>Customer Reviews</h3>
            {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this product!</p>
            ) : (
                <div className="reviews">
                    {reviews.map((review) => (
                        <div key={review._id} className="review-item">
                            <div className="review-header">
                                <div className="review-user-info">
                                    <span className="username">{review.username}</span>
                                    <span className="review-date">
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>
                                <div className="star-rating">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            className="star"
                                            color={index < review.rating ? "#ffc107" : "#e4e5e9"}
                                            size={16}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="review-text">{review.review}</p>
                            {(currentUserId === review.userId || localStorage.getItem('usertype') === 'admin') && (
                                <button
                                    onClick={() => handleDelete(review._id)}
                                    className="delete-review-btn"
                                >
                                    Delete Review
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewList; 