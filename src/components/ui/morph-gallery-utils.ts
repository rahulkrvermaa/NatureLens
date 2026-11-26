export type MorphItem = {
  /** Full-size image. Must be served with CORS headers to be morphed. */
  src: string;
  /** Thumbnail for the strip. Falls back to `src`, which is wasteful. */
  thumb?: string;
  alt?: string;
  title?: string;
  location?: string;
};

/** Wrap past the ends when looping, clamp at them when not. */
export const wrapIndex = (i: number, n: number, loop: boolean): number => {
  if (n <= 0) return 0;
  return loop ? ((i % n) + n) % n : Math.min(Math.max(i, 0), n - 1);
};

/** Quintic in-out: the dissolve starts and ends still, and hurries the middle. */
export const easeInOutQuint = (t: number): number => {
  const x = Math.min(Math.max(t, 0), 1);
  return x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2;
};

/**
 * `object-fit: cover` expressed as a UV scale about the centre.
 */
export const coverScale = (
  canvasAspect: number,
  imgAspect: number
): [number, number] =>
  canvasAspect > imgAspect
    ? [1, imgAspect / canvasAspect]
    : [canvasAspect / imgAspect, 1];

export const NATURE_MORPH_ITEMS: MorphItem[] = [
  {
    src: "/photos/season-6-afternoon-fields.jpg",
    thumb: "/photos/season-6-afternoon-fields.jpg",
    title: "Afternoon Over Green Fields",
    location: "Rahul · Sept 5",
    alt: "Wide green rice fields under soft afternoon clouds",
  },
  {
    src: "/photos/season-5-golden-paddy.jpg",
    thumb: "/photos/season-5-golden-paddy.jpg",
    title: "Golden Hour in the Paddy",
    location: "Rahul · Oct 22",
    alt: "Warm sunset light behind green rice stalks and trees",
  },
  {
    src: "/photos/season-3-blue-hour.jpg",
    thumb: "/photos/season-3-blue-hour.jpg",
    title: "Blue Hour Horizon",
    location: "Rahul · Oct 1",
    alt: "Deep blue evening sky over green fields and distant city lights",
  },
  {
    src: "/photos/season-4-dusk-horizon.jpg",
    thumb: "/photos/season-4-dusk-horizon.jpg",
    title: "Evening Dusk Over Trees",
    location: "Rahul · Sept 30",
    alt: "Twilight sky above green treetops and lit buildings",
  },
  {
    src: "/photos/season-1-night-trees.jpg",
    thumb: "/photos/season-1-night-trees.jpg",
    title: "Quiet Trees at Night",
    location: "Rahul · Sept 28",
    alt: "Tree silhouettes lit by warm streetlamps at night",
  },
  {
    src: "/photos/season-2-night-trails.jpg",
    thumb: "/photos/season-2-night-trails.jpg",
    title: "Night Bridge & Light Trails",
    location: "Rahul · Nov 2",
    alt: "Nighttime trees and passing light trails along the road",
  },
];
