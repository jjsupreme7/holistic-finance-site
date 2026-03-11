import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  buildCheckoutCancelUrl,
  buildCheckoutLineItem,
  buildCheckoutSuccessUrl,
  getProductBySlug,
  getStripe,
  getStripeShippingOptions,
  isStripeCheckoutEnabled,
} from "@/lib/stripe/server";

export const runtime = "nodejs";

function getUserFacingError(error: unknown) {
  if (error instanceof Error && error.message === "Missing STRIPE_SECRET_KEY env var") {
    return {
      status: 503,
      message: "Stripe is not connected yet. Add the account key to enable checkout.",
    };
  }

  if (error instanceof Stripe.errors.StripeError) {
    return {
      status: 502,
      message: "Stripe could not start checkout right now. Please try again shortly.",
    };
  }

  return {
    status: 500,
    message: "Unable to start checkout right now. Please try again or join the updates list.",
  };
}

export async function POST(req: Request) {
  try {
    if (!isStripeCheckoutEnabled()) {
      return NextResponse.json(
        {
          error:
            "Shop checkout is not enabled yet. Join the email updates list and we will announce the launch.",
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const productSlug = typeof body.productSlug === "string" ? body.productSlug : "";
    const selectedSize = typeof body.size === "string" ? body.size : undefined;
    const quantity = typeof body.quantity === "number" ? body.quantity : 1;

    const product = getProductBySlug(productSlug);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
      return NextResponse.json(
        { error: "Please choose a valid quantity between 1 and 5." },
        { status: 400 }
      );
    }

    if (product.sizes?.length && (!selectedSize || !product.sizes.includes(selectedSize))) {
      return NextResponse.json({ error: "Please select a valid size first." }, { status: 400 });
    }

    const shippingOptions = getStripeShippingOptions();
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      client_reference_id: selectedSize ? `${product.slug}:${selectedSize}` : product.slug,
      line_items: [buildCheckoutLineItem(product, quantity)],
      success_url: buildCheckoutSuccessUrl(product.slug),
      cancel_url: buildCheckoutCancelUrl(product.slug),
      allow_promotion_codes: true,
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      ...(shippingOptions
        ? {
            shipping_address_collection: {
              allowed_countries: ["US"] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
            },
            shipping_options: shippingOptions,
          }
        : {}),
      metadata: {
        productSlug: product.slug,
        productTitle: product.title,
        ...(selectedSize ? { selectedSize } : {}),
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const response = getUserFacingError(error);
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
