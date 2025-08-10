"use client";
import { dealURL } from "@/lib/utils";
import { GameDeal } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import styles from "./HomePageDeals.module.scss";
import ImageThumbnail from "./ImageThumbnail";

function DealCard({ deal }: { deal: GameDeal }) {
  return (
    <Link className={styles.dealCard} href={dealURL(deal.dealID)}>
      <ImageThumbnail
        originalUrl={deal.thumb}
        alt={deal.title}
        width={296}
        height={136}
        imageClassName={styles.thumbnail}
        containerClassName={styles.thumbnailContainer}
      />
      <div className={styles.priceInfo}>
        <div className={styles.title}>{deal.title}</div>
        {deal.savings !== "0" && <div className={styles.discount}>-{parseInt(deal.savings)}%</div>}
        <div className={styles.prices}>
          {deal.savings !== "0" && (
            <span className={styles.originalPrice}>A$ {parseFloat(deal.normalPrice).toFixed(2)}</span>
          )}
          <span className={styles.salePrice}>A$ {parseFloat(deal.salePrice).toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePageDeals({ deals }: { deals: GameDeal[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const dealsPerPage = 4;
  const totalPages = Math.ceil(deals.length / dealsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentDeals = deals.slice(currentIndex * dealsPerPage, currentIndex * dealsPerPage + dealsPerPage);

  return (
    <>
      <div className={styles.featuredDealsContainer}>
        <h1 className={styles.featuredDeals}>Featured Deals</h1>
        <div className={styles.carouselContainer}>
          <button className={styles.navButton} onClick={prevSlide} aria-label="Previous deals">
            <IoChevronBack size={24} />
          </button>

          <div className={styles.dealsContainer}>
            {/* Desktop: Show paginated deals */}
            <div className={styles.desktopDeals}>
              {currentDeals.map((deal) => (
                <DealCard key={deal.dealID} deal={deal} />
              ))}
            </div>

            {/* Mobile: Show all deals in scrollable container */}
            <div className={styles.mobileDeals}>
              {deals.map((deal) => (
                <DealCard key={deal.dealID} deal={deal} />
              ))}
            </div>
          </div>

          <button className={styles.navButton} onClick={nextSlide} aria-label="Next deals">
            <IoChevronForward size={24} />
          </button>
        </div>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`${styles.paginationDot} ${index === currentIndex ? styles.active : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
