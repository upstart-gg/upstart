import { manifest as heroManifest } from "./hero.manifest";
import { manifest as imageManifest } from "./image.manifest";
import { manifest as videoManifest } from "./video.manifest";
import { manifest as textManifest } from "./text.manifest";
import { manifest as containerManifest } from "./container.manifest";
import { manifest as cardManifest } from "./card.manifest";
import { manifest as mapManifest } from "./map.manifest";
import { manifest as formManifest } from "./form.manifest";
import { manifest as imagesWallManifest } from "./images-gallery.manifest";
import { manifest as carouselManifest } from "./carousel.manifest";
import { manifest as headerManifest } from "./header.manifest";
import { manifest as footerManifest } from "./footer.manifest";
import { manifest as buttonManifest } from "./button.manifest";
import { manifest as iconManifest } from "./icon.manifest";
import { manifest as socialLinksManifest } from "./social-links.manifest";
import { manifest as countdownManifest } from "./countdown.manifest";
import { manifest as genericComponentManifest } from "./generic-component.manifest";
import { manifest as sidebarManifest } from "./sidebar.manifest";

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
  [headerManifest.type]: headerManifest,
  [footerManifest.type]: footerManifest,
  [buttonManifest.type]: buttonManifest,
  [iconManifest.type]: iconManifest,
  [socialLinksManifest.type]: socialLinksManifest,
  [countdownManifest.type]: countdownManifest,
  [genericComponentManifest.type]: genericComponentManifest,
  [containerManifest.type]: containerManifest,
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
  [headerManifest.type]: getBrickManifestDefaults(headerManifest),
  [footerManifest.type]: getBrickManifestDefaults(footerManifest),
  [buttonManifest.type]: getBrickManifestDefaults(buttonManifest),
  [iconManifest.type]: getBrickManifestDefaults(iconManifest),
  [socialLinksManifest.type]: getBrickManifestDefaults(socialLinksManifest),
  [countdownManifest.type]: getBrickManifestDefaults(countdownManifest),
  [genericComponentManifest.type]: getBrickManifestDefaults(genericComponentManifest),
  [containerManifest.type]: getBrickManifestDefaults(containerManifest),
};
