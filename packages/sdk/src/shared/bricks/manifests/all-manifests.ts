import { manifest as heroManifest, examples as heroExamples } from "./hero.manifest";
import { manifest as imageManifest, examples as imageExamples } from "./image.manifest";
import { manifest as videoManifest, examples as videoExamples } from "./video.manifest";
import { manifest as textManifest, examples as textExamples } from "./text.manifest";
import { manifest as vboxManifest, examples as vboxExamples } from "./vbox.manifest";
import { manifest as cardManifest, examples as cardExamples } from "./card.manifest";
import { manifest as mapManifest, examples as mapExamples } from "./map.manifest";
import { manifest as formManifest, examples as formExamples } from "./form.manifest";
import { manifest as imagesWallManifest, examples as imagesWallExamples } from "./images-gallery.manifest";
import { manifest as carouselManifest, examples as carouselExamples } from "./carousel.manifest";
import { manifest as navbarManifest, examples as navbarExamples } from "./navbar.manifest";
import { manifest as footerManifest, examples as footerExamples } from "./footer.manifest";
import { manifest as buttonManifest, examples as buttonExamples } from "./button.manifest";
import { manifest as iconManifest, examples as iconExamples } from "./icon.manifest";
import { manifest as socialLinksManifest, examples as socialLinksExamples } from "./social-links.manifest";
import { manifest as sidebarManifest, examples as sidebarExamples } from "./sidebar.manifest";
import { manifest as dividerManifest, examples as dividerExamples } from "./divider.manifest";
import { manifest as testimonialsManifest, examples as testimonialsExamples } from "./testimonials.manifest";
import { manifest as timelineManifest, examples as timelineExamples } from "./timeline.manifest";
import { manifest as accordionManifest, examples as accordionExamples } from "./accordion.manifest";

import { getBrickManifestDefaults, type BrickDefaults, type BrickManifest } from "../../brick-manifest";

export const manifests: Record<string, BrickManifest> = {
  [textManifest.type]: textManifest,
  [heroManifest.type]: heroManifest,
  [imageManifest.type]: imageManifest,
  [videoManifest.type]: videoManifest,
  [cardManifest.type]: cardManifest,
  [mapManifest.type]: mapManifest,
  [formManifest.type]: formManifest,
  [sidebarManifest.type]: sidebarManifest,
  [imagesWallManifest.type]: imagesWallManifest,
  [carouselManifest.type]: carouselManifest,
  [navbarManifest.type]: navbarManifest,
  [footerManifest.type]: footerManifest,
  [buttonManifest.type]: buttonManifest,
  [iconManifest.type]: iconManifest,
  [socialLinksManifest.type]: socialLinksManifest,
  [vboxManifest.type]: vboxManifest,
  [dividerManifest.type]: dividerManifest,
  [testimonialsManifest.type]: testimonialsManifest,
  [timelineManifest.type]: timelineManifest,
  [accordionManifest.type]: accordionManifest,
};

export const defaultProps: Record<string, BrickDefaults> = {
  [textManifest.type]: getBrickManifestDefaults(textManifest),
  [heroManifest.type]: getBrickManifestDefaults(heroManifest),
  [imageManifest.type]: getBrickManifestDefaults(imageManifest),
  [videoManifest.type]: getBrickManifestDefaults(videoManifest),
  [cardManifest.type]: getBrickManifestDefaults(cardManifest),
  [sidebarManifest.type]: getBrickManifestDefaults(sidebarManifest),
  [mapManifest.type]: getBrickManifestDefaults(mapManifest),
  [formManifest.type]: getBrickManifestDefaults(formManifest),
  [imagesWallManifest.type]: getBrickManifestDefaults(imagesWallManifest),
  [carouselManifest.type]: getBrickManifestDefaults(carouselManifest),
  [navbarManifest.type]: getBrickManifestDefaults(navbarManifest),
  [footerManifest.type]: getBrickManifestDefaults(footerManifest),
  [buttonManifest.type]: getBrickManifestDefaults(buttonManifest),
  [iconManifest.type]: getBrickManifestDefaults(iconManifest),
  [socialLinksManifest.type]: getBrickManifestDefaults(socialLinksManifest),
  [vboxManifest.type]: getBrickManifestDefaults(vboxManifest),
  [dividerManifest.type]: getBrickManifestDefaults(dividerManifest),
  [testimonialsManifest.type]: getBrickManifestDefaults(testimonialsManifest),
  [timelineManifest.type]: getBrickManifestDefaults(timelineManifest),
  [accordionManifest.type]: getBrickManifestDefaults(accordionManifest),
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const examples: Record<string, { description: string; type: string; props: any }[]> = {
  [textManifest.type]: textExamples,
  [heroManifest.type]: heroExamples,
  [imageManifest.type]: imageExamples,
  [videoManifest.type]: videoExamples,
  [cardManifest.type]: cardExamples,
  [mapManifest.type]: mapExamples,
  [formManifest.type]: formExamples,
  [sidebarManifest.type]: sidebarExamples,
  [imagesWallManifest.type]: imagesWallExamples,
  [carouselManifest.type]: carouselExamples,
  [navbarManifest.type]: navbarExamples,
  [footerManifest.type]: footerExamples,
  [buttonManifest.type]: buttonExamples,
  [iconManifest.type]: iconExamples,
  [socialLinksManifest.type]: socialLinksExamples,
  [vboxManifest.type]: vboxExamples,
  [dividerManifest.type]: dividerExamples,
  [testimonialsManifest.type]: testimonialsExamples,
  [timelineManifest.type]: timelineExamples,
  [accordionManifest.type]: accordionExamples,
};
