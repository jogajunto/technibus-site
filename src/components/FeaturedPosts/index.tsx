"use client";

import ReactDOMServer from "react-dom/server";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";

import { Category, Media, Post } from "@/payload-types";

import { A11y, EffectFade, Pagination } from "swiper/modules";

import { cn } from "@/utilities/cn";

import "swiper/css";
import "swiper/css/effect-fade";
import { Card } from "../Card";

type FeaturedPostsProps = {
  posts: Post[];
};

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  const swiperOptions: SwiperProps = {
    modules: [Pagination, A11y, EffectFade],
    effect: "fade",
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: (index, className) =>
        ReactDOMServer.renderToStaticMarkup(
          <span
            className={cn(
              "aria-current:bg-brand-primary aria-current:outline-brand-primary outline-brand-primary block size-4 cursor-pointer rounded-full bg-transparent outline-2 outline-offset-3 transition-colors duration-300",
              className,
            )}
          >
            <span className="sr-only">Página {index + 1}</span>
          </span>,
        ),
    },
  };

  return (
    <div className="bg-secondary flex flex-col overflow-hidden rounded-lg">
      <div className="relative">
        <Swiper {...swiperOptions}>
          {posts?.map((post) => (
            <SwiperSlide className="bg-secondary h-auto!" key={post.id}>
              <Card url={post.relPermalink} categories={post.category as Category[]} title={post.title} description={post.excerpt} image={post.image as Media} size="lg" />
            </SwiperSlide>
          ))}
          <div className="swiper-pagination z-10 mx-auto mt-4 flex max-w-max justify-center gap-4 rounded-3xl bg-linear-to-t p-2.5"></div>
        </Swiper>
      </div>
    </div>
  );
}
