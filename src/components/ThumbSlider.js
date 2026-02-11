import { useState } from "react";
import styles from "../styles/ThumbSlider.module.css"
// Import Swiper React components
import {Swiper, SwiperSlide} from "swiper/react";
// import Swiper core and required modules
import {Navigation, FreeMode, Thumbs} from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Image from "next/image";

function ThumbSlider({data: product}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <div className={styles.mySlider}>
      <Swiper
        modules={[Navigation, FreeMode, Thumbs]}
        spaceBetween={10}
        navigation={true}
        // loop={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className={styles.productImagesSwiper}>
        {product.images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image className={styles.image} src={image} alt={product.title} width={1500} height={1500} />
            {/* <img className={styles.image} src={image} alt={product.title} /> */}
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        // allowTouchMove={false}
        onSwiper={setThumbsSwiper}
        // loop={product.images.length > 4 ? true : false}
        spaceBetween={2}
        slidesPerView={product.images.length > 4 ? 4 : product.images.length}
        noSwiping
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className={styles.productImagesPagination}>
        {product.images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image className={styles.image} src={image} alt={product.title} width={40} height={40} />
            {/* <img className={styles.image} src={image} alt={product.title} /> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
export default ThumbSlider;
