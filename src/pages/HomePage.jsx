import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
    const [isHovered, setIsHovered] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["home"],
        queryFn: () => productService.getHome().then((res) => res.data.data),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 text-lg">Loading...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500 text-lg">Something went wrong. Please try again.</p>
            </div>
        );
    }

    const { bannerProduct, alternateBannerProduct, featuredCategories, newArrivals } = data;

    const originalImage = bannerProduct?.images?.[0] || "";
    const hoverImage = alternateBannerProduct?.images?.[0] || originalImage;
    const currentBannerImage = isHovered ? hoverImage : originalImage;

    return (
        <div style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>

            <Navbar />

            {/* BANNER */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    overflow: "hidden",
                }}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
            >
                {currentBannerImage && (
                    <img
                        src={currentBannerImage}
                        alt="Banner"
                        style={{
                            position: "absolute",
                            top: 0, left: 0,
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            zIndex: 0,
                        }}
                    />
                )}
                <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1 }} />
                <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 1rem", maxWidth: "48rem" }}>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4">
                        {bannerProduct?.name || "Welcome to TechFocus Store"}
                    </h1>
                    <p className="text-sm sm:text-lg font-light">
                        {bannerProduct?.description || "Discover premium fashion for modern lifestyle."}
                    </p>
                </div>
            </div>

            {/* FEATURED CATEGORIES */}
            <section className="py-4 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-6">Featured Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {featuredCategories && featuredCategories.length > 0 ? (
                            featuredCategories.map((category) => {
                                const catImage = category.products?.[0]?.images?.[0] || "";
                                return (
                                    <Link
                                        key={category._id || category.name}
                                        to={`/product/${category.products?.[0]?._id}`}
                                        style={{
                                            position: "relative",
                                            display: "block",
                                            overflow: "hidden",
                                            borderRadius: "0.5rem",
                                            height: "320px",
                                        }}
                                    >
                                        {/* Category image */}
                                        <img
                                            src={catImage}
                                            alt={`${category.name} Collection`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                                transition: "transform 0.3s ease",
                                            }}
                                            onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                                            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                                        />
                                        {/* Overlay */}
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            backgroundColor: "rgba(0,0,0,0.4)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <h3 style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>
                                                {category.name} Collection
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <p className="text-center col-span-2 text-gray-500">No categories available</p>
                        )}
                    </div>
                </div>
            </section>

            {/* NEW ARRIVALS */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">New Arrivals</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {newArrivals?.map((product) => (
                            <div key={product._id} className="group">
                                <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    <div className="relative overflow-hidden rounded-lg mb-4">
                                        <img
                                            src={product.images?.[0] || ""}
                                            alt={product.name}
                                            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Quick View
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">{product.name}</h3>

                                    {/* ✅ Discount price logic */}
                                    {product.discountPrice ? (
                                        <div className="flex gap-2 items-center">
                                            <p className="text-gray-400 line-through text-sm">Rs. {product.price}</p>
                                            <p className="text-black font-bold">Rs. {product.discountPrice}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">Rs. {product.price}</p>
                                    )}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />

        </div>
    );
}