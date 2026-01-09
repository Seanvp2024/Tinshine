import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div>
                        <div className="mb-6">
                            <img
                                src="https://space-static.coze.site/coze_space/7592923312365764914/upload/cropped-Tinshine-Logo_2328x983.png?sign=1770462906-0c09bcf3e0-0-e8eba198b60ebe81072747a1ce598e4f671bee20e04ad080c73009b981ed04f3"
                                alt="TinShine Logo"
                                className="h-10 w-auto" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <i className="fas fa-phone-alt mt-1 mr-3 text-blue-600 dark:text-blue-400"></i>
                                <div>
                                    <p className="font-medium">Phone</p>
                                    <p className="text-gray-600 dark:text-gray-400">+86 13826956953</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <i className="fas fa-envelope mt-1 mr-3 text-blue-600 dark:text-blue-400"></i>
                                <div>
                                     <p className="font-medium">Email</p>
                                    <p className="text-gray-600 dark:text-gray-400">jancy@tinshine.com</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <i
                                    className="fas fa-map-marker-alt mt-1 mr-3 text-blue-600 dark:text-blue-400"></i>
                                <div>
                                    <p className="font-medium">Address</p>
                                    <p className="text-gray-600 dark:text-gray-300">123 Dongyuan Avenue, shiPai Town, Dongguan City, Guangdong Province,China</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex space-x-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-colors duration-300">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-400 hover:text-white transition-colors duration-300">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-pink-500 hover:text-white transition-colors duration-300">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-linkedin hover:text-white transition-colors duration-300">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-lg mb-4">Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow">
                    <ul className="space-y-2">
                        <li><Link
                                to="/product/food-iron-box"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Food Iron Box</Link></li>
                        <li><Link
                                to="/product/wine-cans"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Wine Cans</Link></li>
                        <li><Link
                                to="/product/cosmetic-tin"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cosmetic Tin</Link></li>
                        <li><Link
                                to="/product/tea-coffee-tin"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tea Coffee Tin</Link></li>
                        <li><Link
                                to="/product/household-goods-tin"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Household Goods Tin</Link></li>
                    </ul>
                    <ul className="space-y-2">
                        <li><Link
                                to="/product/tinplate-can"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tinplate Can</Link></li>
                        <li><Link
                                to="/product/gift-tin"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Gift Tin</Link></li>
                        <li><Link
                                to="/product/new-product-display"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">New Products</Link></li>
                        <li><Link
                                to="/products"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Products</Link></li>
                        <li><Link
                                to="/contact"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Custom Design</Link></li>
                    </ul>
                </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                        <form className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white"
                                    required />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white"
                                    required />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">Send Message
                                                </button>
                        </form>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Metal Box Pack. All rights reserved.
                                        </p>
                        <div className="flex space-x-6">
                            <Link
                                to="#"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Terms of Service</Link>
                            <Link
                                to="#"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Privacy Policy</Link>
                            <Link
                                to="#"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}