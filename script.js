const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-site-nav]");

const setMenuOpen = (open) => {
  menuButton?.setAttribute("aria-expanded", String(open));
  nav?.toggleAttribute("data-open", open);
};

menuButton?.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

const sections = [...document.querySelectorAll("[data-section]")];
const navLinks = [...(nav?.querySelectorAll("a") ?? [])];
const indexCurrent = document.querySelector("[data-index-current]");

const setActiveSection = (section) => {
  const sectionId = section.id;
  document.body.dataset.activeSection = sectionId;
  document.body.style.setProperty(
    "--index-progress",
    `${((sections.indexOf(section) + 1) / sections.length) * 100}%`,
  );
  if (indexCurrent) indexCurrent.textContent = section.dataset.index;

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target);
    },
    { rootMargin: "-32% 0px -48%", threshold: [0, 0.15, 0.45] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const VISITED_COUNTRIES = [
  { country: "China", label: "中国 / CHINA", lat: 36, lng: 103 },
  { country: "Indonesia", label: "印度尼西亚 / INDONESIA", lat: -3, lng: 119 },
];

const CHINA_DESTINATIONS = [
  { name: "南昌", region: "江西", lat: 28.68, lng: 115.86, accent: "china" },
  { name: "上饶", region: "江西", lat: 28.45, lng: 117.97, accent: "china" },
  { name: "景德镇", region: "江西", lat: 29.27, lng: 117.18, accent: "china" },
  { name: "萍乡武功山", region: "江西", lat: 27.47, lng: 114.17, accent: "china" },
  { name: "长沙", region: "湖南", lat: 28.23, lng: 112.94, accent: "home" },
  { name: "邵阳", region: "湖南", lat: 27.24, lng: 111.47, accent: "china" },
  { name: "张家界", region: "湖南", lat: 29.12, lng: 110.48, accent: "china" },
  { name: "杭州", region: "浙江", lat: 30.27, lng: 120.16, accent: "china" },
  { name: "嘉兴乌镇", region: "浙江", lat: 30.75, lng: 120.49, accent: "china" },
  { name: "广州", region: "广东", lat: 23.13, lng: 113.26, accent: "china" },
  { name: "深圳", region: "广东", lat: 22.54, lng: 114.06, accent: "home" },
  { name: "东莞", region: "广东", lat: 23.02, lng: 113.75, accent: "china" },
  { name: "惠州", region: "广东", lat: 23.11, lng: 114.42, accent: "china" },
  { name: "清远", region: "广东", lat: 23.68, lng: 113.06, accent: "china" },
  { name: "武汉", region: "湖北", lat: 30.59, lng: 114.31, accent: "china" },
  { name: "天门", region: "湖北", lat: 30.66, lng: 113.17, accent: "china" },
  { name: "上海", region: "中国", lat: 31.23, lng: 121.47, accent: "china" },
  { name: "北京", region: "中国", lat: 39.90, lng: 116.41, accent: "china" },
  { name: "西安", region: "陕西", lat: 34.34, lng: 108.94, accent: "china" },
  { name: "昆明", region: "云南", lat: 25.04, lng: 102.71, accent: "china" },
  { name: "大理", region: "云南", lat: 25.61, lng: 100.27, accent: "china" },
  { name: "丽江", region: "云南", lat: 26.86, lng: 100.23, accent: "china" },
  { name: "香格里拉", region: "云南", lat: 27.83, lng: 99.70, accent: "china" },
  { name: "海口", region: "海南", lat: 20.04, lng: 110.20, accent: "china" },
  { name: "三亚", region: "海南", lat: 18.25, lng: 109.51, accent: "china" },
  { name: "香港", region: "中国香港", lat: 22.32, lng: 114.17, accent: "special" },
  { name: "澳门", region: "中国澳门", lat: 22.20, lng: 113.54, accent: "special" },
];

// One continuous globe contains every stop, at both world and city scale.
const TRAVEL_STOPS = [...CHINA_DESTINATIONS, { ...VISITED_COUNTRIES[1], name: "印度尼西亚", area: "海外", accent: "abroad" }];
const initTravelGlobe = async (container) => {
  const stage = container.closest('.globe-stage');
  const status = stage.querySelector('.globe-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const number = document.querySelector('[data-stop-number]');
  const name = document.querySelector('[data-stop-name]');
  const region = document.querySelector('[data-stop-region]');
  const coordinates = document.querySelector('[data-stop-coordinates]');
  const directory = document.querySelector('[data-travel-directory]');
  const siteBlue = getComputedStyle(document.documentElement).getPropertyValue('--forward-blue').trim();
  let selected = -1;
  let world;

  const syncButtons = () => document.querySelectorAll('[data-travel-stop]').forEach(button => {
    button.setAttribute('aria-pressed', String(selected >= 0 && button.dataset.travelStop === TRAVEL_STOPS[selected].name));
  });
  const selectStop = (index) => {
    selected = (index + TRAVEL_STOPS.length) % TRAVEL_STOPS.length;
    const place = TRAVEL_STOPS[selected];
    number.textContent = `COORDINATE / ${String(selected + 1).padStart(2, '0')}`;
    name.textContent = place.name;
    region.textContent = place.region || place.area;
    coordinates.textContent = `${Math.abs(place.lat).toFixed(2)}°${place.lat < 0 ? 'S' : 'N'} / ${place.lng.toFixed(2)}°E`;
    container.dataset.selectedStop = place.name;
    syncButtons();
    if (!world) return;
    world.htmlElementsData([place]);
    world.pointRadius(point => point.name === place.name ? .36 : .13);
    world.pointColor(point => point.name === place.name ? '#FFFFFF' : '#D9E5FF');
    world.pointOfView({ lat: place.lat, lng: place.lng, altitude: place.accent === 'abroad' ? 1.2 : .9 }, reducedMotion ? 0 : 1100);
  };
  const resetWorld = () => {
    selected = -1;
    number.textContent = 'EXPLORING / EARTH';
    name.replaceChildren(document.createTextNode('世界很大。'), document.createElement('br'), document.createTextNode('继续出发。'));
    region.textContent = '中国 · 印度尼西亚';
    coordinates.textContent = '从一个坐标，靠近一片真实的风景。';
    delete container.dataset.selectedStop;
    syncButtons();
    if (!world) return;
    world.htmlElementsData(VISITED_COUNTRIES).pointRadius(.16).pointColor(() => '#D9E5FF');
    world.pointOfView({ lat: 24, lng: 108, altitude: stage.clientWidth > 700 ? 1.75 : 2.05 }, reducedMotion ? 0 : 1000);
  };
  TRAVEL_STOPS.forEach((place, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.travelStop = place.name;
    button.textContent = place.name;
    button.addEventListener('click', () => selectStop(index));
    directory.append(button);
  });
  document.querySelectorAll('.travel-route [data-travel-stop]').forEach(button => {
    button.addEventListener('click', () => selectStop(TRAVEL_STOPS.findIndex(place => place.name === button.dataset.travelStop)));
  });
  document.querySelector('[data-random-stop]').addEventListener('click', () => {
    // Always move to a different stop when a place is already selected.
    const offset = 1 + Math.floor(Math.random() * (TRAVEL_STOPS.length - 1));
    selectStop(selected < 0 ? Math.floor(Math.random() * TRAVEL_STOPS.length) : selected + offset);
  });
  document.querySelector('[data-stop-prev]').addEventListener('click', () => selectStop(selected < 0 ? TRAVEL_STOPS.length - 1 : selected - 1));
  document.querySelector('[data-stop-next]').addEventListener('click', () => selectStop(selected + 1));
  document.querySelector('[data-world-reset]').addEventListener('click', resetWorld);
  syncButtons();
  container.addEventListener('keydown', event => {
    if (event.key === 'Escape') { resetWorld(); return; }
    const delta = event.key === 'ArrowLeft' ? -8 : event.key === 'ArrowRight' ? 8 : 0;
    if (!delta || !world) return;
    event.preventDefault();
    const view = world.pointOfView();
    world.pointOfView({ ...view, lng: view.lng + delta }, reducedMotion ? 0 : 250);
  });

  try {
    if (typeof window.Globe !== 'function') throw new Error('Globe library unavailable');
    const response = await fetch('assets/maps/world-countries.geojson?v=1');
    if (!response.ok) throw new Error(`World map ${response.status}`);
    const countries = await response.json();
    world = window.Globe()(container)
      .width(stage.clientWidth).height(stage.clientHeight)
      .backgroundColor('rgba(0,0,0,0)').showAtmosphere(false)
      .polygonsData(countries.features)
      .polygonAltitude(.003)
      .polygonCapColor(feature => ['China', 'Indonesia'].includes(feature.properties?.ADMIN) ? siteBlue : '#BAC8D5')
      .polygonSideColor(() => '#BAC8D5')
      .polygonStrokeColor(() => 'rgba(250,251,252,.7)')
      .polygonsTransitionDuration(0)
      .pointsData(TRAVEL_STOPS)
      .pointLat('lat').pointLng('lng').pointAltitude(.008).pointRadius(.16)
      .pointColor(() => '#D9E5FF').pointsTransitionDuration(0)
      .pointLabel(place => place.name)
      .onPointClick(place => selectStop(TRAVEL_STOPS.indexOf(place)))
      .htmlElementsData(VISITED_COUNTRIES)
      .htmlLat('lat').htmlLng('lng').htmlAltitude(.014).htmlTransitionDuration(0)
      .htmlElement(place => {
        const label = document.createElement('div');
        label.setAttribute('aria-hidden', 'true');
        if (place.name) {
          label.className = 'globe-place-label';
          label.textContent = place.name;
        } else {
          label.className = 'globe-country-label';
          const [chinese, english] = place.label.split(' / ');
          label.append(document.createTextNode(chinese));
          const subtitle = document.createElement('span');
          subtitle.textContent = english;
          label.append(subtitle);
        }
        return label;
      })
      .onZoom(view => { container.dataset.camera = `${view.lat.toFixed(3)},${view.lng.toFixed(3)},${view.altitude.toFixed(3)}`; });
    world.globeMaterial().color.set('#E4EBF2');
    world.globeMaterial().emissive.set('#E4EBF2');
    world.globeMaterial().emissiveIntensity = .25;
    world.globeMaterial().shininess = 0;
    const controls = world.controls();
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = false;
    controls.minDistance = 120;
    controls.maxDistance = 450;
    if (selected < 0) resetWorld(); else selectStop(selected);
    new ResizeObserver(() => {
      if (stage.clientWidth && stage.clientHeight) world.width(stage.clientWidth).height(stage.clientHeight);
    }).observe(stage);
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) world.resumeAnimation(); else world.pauseAnimation();
    }, { rootMargin: '200px' }).observe(stage);
    stage.classList.add('is-ready');
  } catch (error) {
    stage.classList.add('has-error');
    status.textContent = '地球暂时未能加载，你仍可通过下方地名浏览我的旅行坐标。';
    console.warn('Travel globe unavailable', error);
  }
};
const globeContainer = document.querySelector('#travel-globe');
if (globeContainer) initTravelGlobe(globeContainer);

document.querySelectorAll(".book__cover-frame img").forEach((image) => {
  image.addEventListener("error", () => {
    image.hidden = true;
    image.parentElement?.classList.add("is-missing");
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const status = button.querySelector("[data-copy-status]");

    try {
      await navigator.clipboard.writeText(value);
      if (status) status.textContent = "已复制";
      window.setTimeout(() => {
        if (status) status.textContent = "点击复制";
      }, 1800);
    } catch {
      if (status) status.textContent = value;
    }
  });
});
