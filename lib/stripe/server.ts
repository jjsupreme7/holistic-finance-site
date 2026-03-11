import Stripe from "stripe";
import { PRODUCTS, type Product } from "@/lib/constants";

let _stripe: Stripe | null = null;

export function isStripeCheckoutEnabled() {
  return process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_ENABLED === "true";
}

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY env var");
  }

  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

export function getStripeSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://myholisticfinance.com";
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getStripeShippingOptions():
  | Stripe.Checkout.SessionCreateParams.ShippingOption[]
  | undefined {
  const standardShippingRate = process.env.STRIPE_SHIPPING_RATE_STANDARD_ID;

  if (!standardShippingRate) {
    return undefined;
  }

  return [{ shipping_rate: standardShippingRate }];
}

function getStripeProductImage(product: Product) {
  if (!product.image) return undefined;
  if (product.image.startsWith("http://") || product.image.startsWith("https://")) {
    return product.image;
  }

  return new URL(product.image, getStripeSiteUrl()).toString();
}

export function buildCheckoutLineItem(
  product: Product,
  quantity: number
): Stripe.Checkout.SessionCreateParams.LineItem {
  const configuredPrice = process.env[product.stripePriceEnv];

  if (configuredPrice) {
    return {
      price: configuredPrice,
      quantity,
    };
  }

  const image = getStripeProductImage(product);

  return {
    quantity,
    price_data: {
      currency: "usd",
      unit_amount: product.priceInCents,
      product_data: {
        name: product.title,
        description: product.description,
        ...(image ? { images: [image] } : {}),
      },
    },
  };
}

export function buildCheckoutSuccessUrl(productSlug: string) {
  const url = new URL("/shop/success", getStripeSiteUrl());
  url.searchParams.set("product", productSlug);
  return `${url.toString()}&session_id={CHECKOUT_SESSION_ID}`;
}

export function buildCheckoutCancelUrl(productSlug: string) {
  const url = new URL("/shop/cancel", getStripeSiteUrl());
  url.searchParams.set("product", productSlug);
  return url.toString();
}
