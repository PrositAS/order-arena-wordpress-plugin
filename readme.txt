=== Order Arena ===
Contributors: prositas
Tags: catering, orders, restaurant, kitchen, food delivery
Tested up to: 6.7.2
Stable tag: <%= htmlWebpackPlugin.options.version %>
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

The ultimate WordPress plugin designed to showcase your catering menu and streamline order requests effortlessly.

== Description ==

**This plugin requires an [Order Arena](https://orderarena.com/) subscription!**

Elevate your catering business with Order Arena, the ultimate WordPress plugin designed to showcase your catering menu and streamline order requests effortlessly. Whether you're a restaurant, event planner, or caterer, Order Arena offers a comprehensive solution to present your menu attractively and manage customer orders efficiently.

## Key Features:

* **Automatic articles and article groups**: Information is fetched from the Order Arena administration system. Articles with descriptions, images and prices are grouped and organized in the page menu.
* **Shopping basket and ordering**: The basket keeps an overview of current state of the order. Accompanied by an intuitive customer details interface, the ordering experience is incredibly smooth.
* **Customizable Color Scheme**: Choose from a range of color options to match your branding and enhance the overall look and feel of your website.
* **Responsive Design**: Ensure a seamless experience across all devices, Order Arena's mobile-friendly design adapts to any screen size, allowing customers to view your menu and place orders on-the-go.
* **User-Friendly Interface**: Designed with ease of use in mind, Order Arena integrates smoothly with your existing WordPress site. Its straightforward setup and management ensure that you can focus on what you do best—delivering exceptional catering services.
* **Predefined Pages**: Includes dedicated pages for your menu (food, equipment, and venues), checkout, terms and conditions and user profile with past orders details.
* **User Registration and Login**: Allow customers to create an account and log in to access their order requests.
* **Easy Order Requests**: Allow customers to place order requests directly through your website. The intuitive order form collects essential details like event date, number of guests, and menu selections, simplifying the ordering process for both you and your clients.
* **Access to Management Dashboard**: Manage your catering menu items and categories. Follow the status of your order requests, view order details, and make changes if necessary.
* **Multilingual Support**: Order Arena supports English and Norwegian (Bokmål). Support for other languages coming later.

Public Order Arena Plugin [repo](https://github.com/PrositAS/order-arena-wordpress-plugin)

== Frequently Asked Questions ==

= The plugin pages are not visible on my site =

Make sure you have added the pages to your menu.
You can do this by navigating to "Appearance > Menus" in your WordPress Dashboard and checking/configuring the menu.

If the preconfigured pages are not available under the menu items selector, you can add them manually by creating "Custom Links" items.
You can check the predefined pages URLs under "Order Arena Pages" section in your Dashboard.

= How do I change the color scheme? =

Adjust the color scheme on the "Order Arena Settings" page by choosing among available options for primary, accent, and warning palettes.

= Image headers are not showing =

Configure the image headers on the Order Arena Settings page. You can pick images from your WordPress media library or use an image URL.

Panoramic images are ideal; if not available, crop your image to a panoramic aspect ratio.

= 404 on predefined pages =

Save/refresh your permalinks settings and try again. (May require setting permalinks to postname structure).

= Divi theme: Order Arena Pages are not displayed correctly =

Configure the header/footer for Order Arena Pages in Divi Theme Builder.

== Screenshots ==

1. Color scheme settings.
2. Image headers settings.
3. Predefined pages.
4. Menu page.
5. Article details.
6. Basket panel.
7. Checkout page - Delivery address.
8. Checkout page - Delivery details.
9. Order confirmation.
10. Customer registration page.
11. Login page.
12. Terms and conditions page.

== External services ==

This plugin integrates with the Order Arena API to collect and manage catering articles, order requests, and customer information, necessary for syncing with the Order Arena administration system.

Data handled includes:

* Catering menu items and groups (descriptions, images, and prices).
* Customer order details and requests.
* User account information for registration and login functionalities.

For detailed terms of use and privacy policies, please refer to [Order Arena's Terms of Use](https://orderarena.com/terms-of-use/).

== Changelog ==

= 1.2.10 =
**Release date:** 12.06.2025
* *feat*: lock order button while order is already being placed
* *feat*: inactive account error shown on login form
* *feat*: pagination on orders history page
* *fix*: optimise order history loading
* *fix*: design adjustments

= 1.2.9 =
**Release date:** 14.05.2025
* *fix*: Divi theme support for Theme Builder headers/footers

= 1.2.8 =
**Release date:** 13.05.2025
* *feat*: Divi theme support

= 1.2.7 =
**Release date:** 15.04.2025
* *feat*: custom color settings
* *fix*: time input autojump prevents the user from changing hour

= 1.2.6 =
**Release date:** 25.03.2025

* *feat*: enhance visibility of disabled dates in calendar
* *feat*: handle resetting password through email link

= 1.2.5 =
**Release date:** 20.02.2025

* *fix*: admin only child articles showing in article details
* *update*: toast message change for password reset request

= 1.2.4 =
**Release date:** 18.02.2025

* *add*: plugin icon, banners and readme screenshots
* *update*: translations

= 1.2.3 =
**Release date:** 17.02.2025

Optimize release process.

= 1.2.2 =
CI/CD pipeline to automate plugin release process.

= 1.2.1 =
Added dynamic color palettes generation for Order Arena Plugin.

= 1.2.0 =
Initial plugin release.
