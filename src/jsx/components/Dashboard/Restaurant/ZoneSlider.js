import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper";
import "swiper/css";

const ZoneSlider = ({ zones }) => {
  return (
    <>
      <Swiper
        className="mySwiper-3"
        slidesPerView={3}
        spaceBetween={20}
        modules={[Autoplay]}
        breakpoints={{
          360: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          600: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1480: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1920: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
      >
        {zones.map((zone, index) => (
          <SwiperSlide key={index}>
            <div className="card b-hover">
              <div className="card-body p-3">
                <div className="menu-bx">
                  <div className="d-flex align-items-center justify-content-center">
                    {/* Assuming zone.image is the image URL */}
                    {/* <img src={zone.image} alt={zone.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} /> */}
                  </div>
                  <div className="text-center mt-3">
                    <Link to={"#"}><h4 className="font-w500">{zone.title}</h4></Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default ZoneSlider;
