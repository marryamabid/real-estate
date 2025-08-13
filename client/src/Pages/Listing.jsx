import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const listingId = params.listingId;
  const [listing, setListing] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/listing/getListing/${listingId}`);
      const data = await res.json();
      if (data.message === false) {
        console.log(data.message);
        setLoading(false);
        setError(true);
        return;
      }
      console.log(data);
      setListing(data);
      setLoading(false);
      setError(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setError(true);
    }
  };
  useEffect(() => {
    fetchListing();
  }, [listingId]);

  return (
    <main>
      {loading && <p className="text-center text-3xl my-7">loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[400px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
}
