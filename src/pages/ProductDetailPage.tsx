import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { getProducts, getReviews, setReviews, getUsers, setProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Product, Review } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviewsState] = useState<Review[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5 as 1 | 2 | 3 | 4 | 5,
    comment: ''
  });

  useEffect(() => {
    if (id) {
      const products = getProducts();
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      
      const allReviews = getReviews();
      const productReviews = allReviews.filter((r: Review) => r.productId === id);
      setReviewsState(productReviews);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!currentUser) {
      addToast('error', 'Please log in to add items to cart');
      return;
    }
    
    if (currentUser.role !== 'CUSTOMER') {
      addToast('error', 'Only customers can add items to cart');
      return;
    }

    if (!product || product.stock < quantity) {
      addToast('error', 'Not enough stock available');
      return;
    }

    add(product.id, quantity);
    addToast('success', `Added ${quantity} item(s) to cart!`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || currentUser.role !== 'CUSTOMER') {
      addToast('error', 'Only customers can leave reviews');
      return;
    }

    if (!product) return;

    // Check if user already reviewed this product
    const existingReview = reviews.find(r => r.customerId === currentUser.id);
    if (existingReview) {
      addToast('error', 'You have already reviewed this product');
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      productId: product.id,
      customerId: currentUser.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      createdAt: new Date().toISOString()
    };

    const allReviews = getReviews();
    const updatedReviews = [...allReviews, newReview];
    setReviews(updatedReviews);
    setReviewsState([...reviews, newReview]);

    // Update product rating
    const newRatingCount = product.ratingCount + 1;
    const newRatingAvg = ((product.ratingAvg * product.ratingCount) + reviewForm.rating) / newRatingCount;
    
    const allProducts = getProducts();
    const updatedProducts = allProducts.map(p =>
      p.id === product.id
        ? { ...p, ratingAvg: newRatingAvg, ratingCount: newRatingCount }
        : p
    );
    setProducts(updatedProducts);
    setProduct({ ...product, ratingAvg: newRatingAvg, ratingCount: newRatingCount });

    setShowReviewForm(false);
    setReviewForm({ rating: 5, comment: '' });
    addToast('success', 'Review submitted successfully!');
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  const seller = getUsers().find(u => u.id === product.sellerId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <div>
          <div className="relative mb-4">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(Math.min(product.images.length - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex === product.images.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="text-sm text-gray-500 font-medium">{product.brand}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.title}</h1>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.ratingAvg)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-lg font-medium ml-2">
                {product.ratingAvg.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500">({product.ratingCount} reviews)</span>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">${product.price}</span>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>Stock: {product.stock} available</span>
              <span>Sold by: {seller?.name}</span>
            </div>
            
            {product.stock > 0 ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="text-center py-4 bg-red-50 rounded-lg">
                <span className="text-red-600 font-semibold">Out of Stock</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Reviews ({reviews.length})
          </h2>
          {currentUser?.role === 'CUSTOMER' && !reviews.find(r => r.customerId === currentUser.id) && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: rating as 1 | 2 | 3 | 4 | 5 })}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= reviewForm.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            reviews.map((review) => {
              const reviewer = getUsers().find(u => u.id === review.customerId);
              return (
                <div key={review.id} className="bg-white border rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {reviewer?.avatarUrl ? (
                        <img
                          src={reviewer.avatarUrl}
                          alt={reviewer.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{reviewer?.name || 'Anonymous'}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;