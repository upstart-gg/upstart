import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import type { BrickProps } from "../props/types";
import { BsCodeSquare } from "react-icons/bs";

import { Type } from "@sinclair/typebox";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "html",
  name: "Html",
  category: "widgets",
  description:
    "A flexible brick that accepts HTML content. Useful for embeding custom HTML or third-party widgets.",
  aiInstructions:
    "Use only this brick type when integrating third party widgets or custom HTML content. Most of the time, you should use other bricks that are more secure and easier to use.",
  staticClasses: "self-stretch",
  defaultWidth: {
    mobile: "auto",
    desktop: "300px",
  },
  icon: BsCodeSquare,
  props: defineProps({
    html: Type.String({
      title: "HTML Content",
      description: "The HTML content to render. Use with caution, as it can introduce security risks.",
      default: "<div>Your HTML content here</div>",
      "ui:placeholder": "<div>Your HTML content here</div>",
      "ui:multiline": true,
      metadata: {
        category: "content",
      },
    }),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "A tally form",
    type: "html",
    props: {
      html: '<iframe data-tally-src="https://tally.so/embed/wQZpd8?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="282" frameborder="0" marginheight="0" marginwidth="0" title="test"></iframe>',
    },
  },
  {
    description: "YouTube video embed",
    type: "html",
    props: {
      html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
    },
  },
  {
    description: "Google Maps embed",
    type: "html",
    props: {
      html: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.309059887159!2d-74.00849368459473!3d40.71278097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedccab%3A0xa2008c34c27bfb67!2sWall%20St%2C%20New%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1620000000000" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
    },
  },
  {
    description: "Twitter tweet embed",
    type: "html",
    props: {
      html: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Just setting up my twttr</p>&mdash; Jack Dorsey (@jack) <a href="https://twitter.com/jack/status/20?ref_src=twsrc%5Etfw">March 21, 2006</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
    },
  },
  {
    description: "CodePen embed for code showcase",
    type: "html",
    props: {
      html: '<iframe height="300" style="width: 100%;" scrolling="no" title="CSS Animation Example" src="https://codepen.io/team/codepen/embed/PNaGbb?height=300&theme-id=light&default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>',
    },
  },
  {
    description: "Calendly scheduling widget",
    type: "html",
    props: {
      html: '<div class="calendly-inline-widget" data-url="https://calendly.com/your-name/30min" style="min-width:320px;height:630px;"></div><script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>',
    },
  },
  {
    description: "Custom pricing table with CSS styling",
    type: "html",
    props: {
      html: '<div style="display: flex; gap: 20px; justify-content: center;"><div style="border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; background: white;"><h3 style="margin: 0 0 16px; color: #1e293b;">Basic</h3><div style="font-size: 32px; font-weight: bold; color: #0ea5e9;">$9</div><p style="color: #64748b; margin: 8px 0 20px;">per month</p><ul style="list-style: none; padding: 0; margin: 0;"><li style="padding: 8px 0;">✓ 5 Projects</li><li style="padding: 8px 0;">✓ 10GB Storage</li><li style="padding: 8px 0;">✓ Email Support</li></ul></div></div>',
    },
  },
  {
    description: "Mailchimp newsletter signup form",
    type: "html",
    props: {
      html: '<div id="mc_embed_signup"><form action="https://your-domain.us1.list-manage.com/subscribe/post?u=123456789&amp;id=abcdefghij" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate><div id="mc_embed_signup_scroll"><div class="mc-field-group"><label for="mce-EMAIL">Email Address</label><input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;"></div><div id="mce-responses" class="clear"><div class="response" id="mce-error-response" style="display:none"></div><div class="response" id="mce-success-response" style="display:none"></div></div><div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_123456789_abcdefghij" tabindex="-1" value=""></div><div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button" style="background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;"></div></div></form></div>',
    },
  },
  {
    description: "Stripe payment button integration",
    type: "html",
    props: {
      html: '<script async src="https://js.stripe.com/v3/buy-button.js"></script><stripe-buy-button buy-button-id="buy_btn_1234567890" publishable-key="pk_test_1234567890"></stripe-buy-button>',
    },
  },
  {
    description: "Instagram post embed",
    type: "html",
    props: {
      html: '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/ABC123/" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote><script async src="//www.instagram.com/embed.js"></script>',
    },
  },
  {
    description: "Custom countdown timer widget",
    type: "html",
    props: {
      html: '<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;"><h3 style="margin: 0 0 20px; font-size: 24px;">Event Countdown</h3><div id="countdown" style="display: flex; justify-content: center; gap: 20px;"><div style="text-align: center;"><div style="font-size: 32px; font-weight: bold;">10</div><div style="font-size: 14px; opacity: 0.8;">DAYS</div></div><div style="text-align: center;"><div style="font-size: 32px; font-weight: bold;">15</div><div style="font-size: 14px; opacity: 0.8;">HOURS</div></div><div style="text-align: center;"><div style="font-size: 32px; font-weight: bold;">30</div><div style="font-size: 14px; opacity: 0.8;">MINUTES</div></div></div></div>',
    },
  },
  {
    description: "Interactive feedback widget with rating stars",
    type: "html",
    props: {
      html: '<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; background: #f8fafc;"><h4 style="margin: 0 0 16px; color: #1e293b;">How was your experience?</h4><div style="display: flex; gap: 8px; margin: 16px 0;"><span style="font-size: 24px; cursor: pointer; color: #fbbf24;">★</span><span style="font-size: 24px; cursor: pointer; color: #fbbf24;">★</span><span style="font-size: 24px; cursor: pointer; color: #fbbf24;">★</span><span style="font-size: 24px; cursor: pointer; color: #fbbf24;">★</span><span style="font-size: 24px; cursor: pointer; color: #d1d5db;">★</span></div><textarea placeholder="Tell us more about your experience..." style="width: 100%; height: 80px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical; font-family: inherit;"></textarea><button style="margin-top: 12px; background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">Submit Feedback</button></div>',
    },
  },
];
