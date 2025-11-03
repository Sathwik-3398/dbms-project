import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { Upload, BookOpen, DollarSign } from 'lucide-react';

const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    condition: 'good',
    price: '',
    originalPrice: '',
    category: 'fiction',
    genre: '',
    language: 'English',
    publicationYear: '',
    publisher: '',
    pages: '',
    format: 'paperback',
    listingType: 'both',
    location: {
      city: '',
      state: '',
      country: ''
    },
    images: []
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        uploadedUrls.push(response.data.url);
        
        if (response.data.message) {
          toast.info(response.data.message);
        }
      }

      setImageUrls(prev => [...prev, ...uploadedUrls]);
      
      if (uploadedUrls.length > 0) {
        toast.success(`${files.length} image(s) processed`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Image upload failed. Using placeholder.');
      setImageUrls(prev => [...prev, 'https://via.placeholder.com/400x600?text=Book+Cover']);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
        publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : new Date().getFullYear(),
        pages: formData.pages ? parseInt(formData.pages) : 100,
        genre: formData.genre ? formData.genre.split(',').map(g => g.trim()) : [],
        images: imageUrls.length > 0 ? imageUrls : ['https://via.placeholder.com/400x600?text=Book+Cover']
      };

      await api.post('/books', bookData);
      toast.success('Book added successfully!');
      navigate('/seller/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <BookOpen className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold">Add New Book</h1>
        </div>

        <form onSubmit={handleSubmit} className="card">
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Book Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="The Great Gatsby"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Author *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="F. Scott Fitzgerald"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  ISBN (Optional)
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="978-0-7432-7356-5"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Publisher
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Scribner"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Publication Year
                </label>
                <input
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="1925"
                  min="1000"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Number of Pages
                </label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="180"
                  min="1"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="Describe the book, its condition, and any special notes..."
              />
            </div>
          </div>

          {/* Category & Condition */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Category & Details</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="academic">Academic</option>
                  <option value="textbook">Textbook</option>
                  <option value="comics">Comics</option>
                  <option value="children">Children</option>
                  <option value="young-adult">Young Adult</option>
                  <option value="biography">Biography</option>
                  <option value="history">History</option>
                  <option value="science">Science</option>
                  <option value="technology">Technology</option>
                  <option value="self-help">Self Help</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Format *
                </label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="paperback">Paperback</option>
                  <option value="hardcover">Hardcover</option>
                  <option value="ebook">eBook</option>
                  <option value="audiobook">Audiobook</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Genre (comma separated)
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Classic, American Literature"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="English"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing & Listing Type
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Selling Price * ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="15.99"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Original Price ($)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="25.99"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Listing Type *
                </label>
                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="sale">For Sale Only</option>
                  <option value="exchange">For Exchange Only</option>
                  <option value="both">Sale & Exchange</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Location</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  City
                </label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  State
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="NY"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Country
                </label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="USA"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Book Images
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-block"
              >
                <div className="text-gray-600">
                  <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-lg font-medium">
                    {uploading ? 'Uploading...' : 'Click to upload images'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG up to 5MB (Optional - placeholder will be used if skipped)
                  </p>
                </div>
              </label>

              {imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Book ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="btn-primary flex-1 py-3 text-lg"
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard')}
              className="btn-secondary px-8 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
