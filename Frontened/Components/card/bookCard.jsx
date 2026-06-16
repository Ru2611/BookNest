
import Card from 'react-bootstrap/Card';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// main.jsx

import './bookCard.css';
import { isWishlisted, subscribeWishlist, toggleWishlistId } from "../../lib/wishlist";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { apiPostJson, API_BASE_URL } from "../../lib/api";


const BookCard = (props) => {
  const { id, image, title, author, price, type, seller, description, genre } =
    props.bookData;
  const [open, setOpen] = React.useState(false);
  const [wishlisted, setWishlisted] = React.useState(() => isWishlisted(id));
  const navigate = useNavigate();
 
  const handleOpen = () => setOpen(!open);

  React.useEffect(() => subscribeWishlist(() => setWishlisted(isWishlisted(id))), [id]);

  const priceLabel =
    String(type).toLowerCase() === "donate" || Number(price) === 0
      ? "Free"
      : `₹${Number(price)}`;

  const [avgRating, setAvgRating] = React.useState(() => (props.bookData?.avg_rating ? Number(props.bookData.avg_rating) : 0));
  const [ratingCount, setRatingCount] = React.useState(() => (props.bookData?.rating_count ? Number(props.bookData.rating_count) : 0));
  const [ratingValue, setRatingValue] = React.useState(5);

  const currentSellerName = typeof window !== 'undefined' ? window.localStorage.getItem('sellerName') : null;

  const submitRating = async () => {
    try {
      await apiPostJson(`/books/${id}/rate`, { rating: ratingValue });
      // fetch updated avg from backend
      const res = await fetch(`${API_BASE_URL}/books/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAvgRating(Number(data.avg_rating || 0));
        setRatingCount(Number(data.rating_count || 0));
      } else {
        // optimistic local update
        setAvgRating((prev) => (prev * ratingCount + ratingValue) / (ratingCount + 1));
        setRatingCount((c) => c + 1);
      }
    } catch (err) {
      setAvgRating((prev) => (prev * ratingCount + ratingValue) / (ratingCount + 1));
      setRatingCount((c) => c + 1);
    }
  };

  return(
    <Card className="book-card">
      {/* Image as button */}
      <div className="book-card__media relative">
        <button
          type="button"
          onClick={handleOpen}
          className="book-card__mediaButton"
          aria-label={`Quick view: ${title}`}
        >
          <Card.Img 
            variant="top" 
            src={image} 
            alt={title}
            className="book-card__img"
            style={{ cursor: 'pointer' }}
          />
        </button>

        <button
          type="button"
          onClick={() => toggleWishlistId(id)}
          className={
            wishlisted
              ? "book-card__wish absolute right-3 top-3 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-rose-600 shadow"
              : "book-card__wish absolute right-3 top-3 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow"
          }
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={wishlisted ? "Saved" : "Save"}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>
      
      <Card.Body className="book-card__body">
        <div>
          <Card.Title className="book-card__title">{title}</Card.Title>
          <Card.Subtitle className="book-card__author mb-2 text-muted">
            {author}
          </Card.Subtitle>

          <div className="book-card__meta">
            <span className="book-card__price">{priceLabel}</span>
            {type && (
              String(type).toLowerCase() === "donate" ? (
                <span className="badge badge-donate">Donation</span>
              ) : (
                <span className="badge badge-sell">For sale</span>
              )
            )}
            {genre ? <span className="badge bg-secondary">{genre}</span> : null}
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpen}
          className="book-card__cta mt-auto w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
        >
          Quick View
        </button>
      </Card.Body>

      <Dialog open={open} handler={handleOpen} size="lg">
        <DialogHeader>{title}</DialogHeader>
        <DialogBody>
          <div className="row">
            <div className="col-md-5">
              <img 
                src={image} 
                alt={title} 
                className="img-fluid rounded-lg"
              />
            </div>
            <div className="col-md-7">
              <h5>by {author}</h5>
              <p className="text-primary h4">{priceLabel}</p>
              {type && <p><strong>Type:</strong> {type}</p>}
              {seller && (
                <p>
                  <strong>Seller:</strong>{" "}
                  {typeof seller === "string"
                    ? seller
                    : `${seller?.name || "Unknown"}${seller?.city ? ` · ${seller.city}` : ""}`}
                </p>
              )}
              <p>
                <strong>Rating:</strong> {avgRating ? avgRating.toFixed(1) : "—"} {ratingCount ? `(${ratingCount})` : ""}
              </p>
              {seller && currentSellerName && typeof seller !== 'string' && seller.name === currentSellerName && (
                <div style={{ marginTop: 8 }}>
                  <label style={{ display: 'block', marginBottom: 6 }}>Your rating</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select value={ratingValue} onChange={(e) => setRatingValue(Number(e.target.value))}>
                      <option value={5}>5</option>
                      <option value={4}>4</option>
                      <option value={3}>3</option>
                      <option value={2}>2</option>
                      <option value={1}>1</option>
                    </select>
                    <button className="btn-primary" type="button" onClick={submitRating}>Submit</button>
                  </div>
                </div>
              )}
              <p><strong>Genre:</strong> {genre}</p>
              <p><strong>Description:</strong> {description}</p>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            Close
          </Button>
          <Button 
            variant="gradient" 
            color="green" 
            onClick={() => {
              handleOpen();
              navigate(`/books/${id}`, { state: props.bookData });
            }}
          >
            View Full Details
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
};

export default BookCard;
//   return (
//     <Card style={{ width: '18rem' }}>
//       <Card.Img variant="top" src={image} onClick={handelClick}/>

//       <Card.Body>
//         <Card.Title>{title}</Card.Title>

//         <Card.Text>
//           Author: {author}
//         </Card.Text>

//         <Card.Text>
//           Price: ₹{price}
//         </Card.Text>

//         <Card.Text>
//           Type: {type}
//         </Card.Text>

//         <Card.Text>
//           Seller: {seller.name}
//           Seller: {seller.city}
//         </Card.Text>

//         <Card.Text>
//         Description:{description}
//         </Card.Text>
//         <Card.Text>
//          Genre: {genre}
//         </Card.Text>

//         <Button variant="primary" onClick={()=>{handelClick(props.bookId)}}>View Book</Button>
//       </Card.Body>
//     </Card>
//   );
// }
