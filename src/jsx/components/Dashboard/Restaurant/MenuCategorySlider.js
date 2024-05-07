import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";
import { Link } from 'react-router-dom';

// Import this component in the parent component and pass the categories prop like <MenuCategorySlider categories={categories} />
const MenuCategorySlider = ({ categories }) => {
    return (
        <>
            <Swiper
                className="mySwiper-2"
                slidesPerView={6}
                spaceBetween={20}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                breakpoints={{
                    360: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    600: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 5,
                        spaceBetween: 20,
                    },
                    1200: {
                        slidesPerView: 6,
                        spaceBetween: 20,
                    },
                    1480: {
                        slidesPerView: 6,
                        spaceBetween: 20,
                    },
                    1600: {
                        slidesPerView: 6,
                        spaceBetween: 20,
                    },
                    1920: {
                        slidesPerView: 6,
                        spaceBetween: 10,
                    },
                }}
            >
                {categories.map(category => (
                    <SwiperSlide key={category.id_category}>
                        <Link to={`/category/${category.id_category}`}>  
                            <div className="cate-bx text-center">
                                <div className="card">
                                    <div className="card-body">
                                        {/* You can dynamically render category specific icons or images here */}
                                        <h6 className="mb-0 font-w500">{category.categoryTitle}</h6>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default MenuCategorySlider;
