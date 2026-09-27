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

const atlasTabs = [...document.querySelectorAll('[data-atlas-target]')];
const setAtlasView = (view, moveFocus = false) => {
  atlasTabs.forEach((tab) => {
    const active = tab.dataset.atlasTarget === view;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) panel.hidden = !active;
    if (active && moveFocus) tab.focus({ preventScroll: true });
  });
};
atlasTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setAtlasView(tab.dataset.atlasTarget));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % atlasTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + atlasTabs.length) % atlasTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = atlasTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setAtlasView(atlasTabs[next].dataset.atlasTarget, true);
  });
});
document.querySelector('[data-atlas-enter]')?.addEventListener('click', () => setAtlasView('china', true));

const initTravelGlobe = async (container) => {
  const stage = container.closest(".globe-stage");
  const status = stage?.querySelector(".globe-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const showError = () => {
    stage?.classList.add("has-error");
    if (status) status.textContent = "地球暂时没有连上线，请稍后刷新再看。";
  };

  if (typeof window.Globe !== "function") {
    showError();
    return;
  }

  try {
    const response = await fetch("https://cdn.jsdelivr.net/npm/globe.gl@2.46.1/example/datasets/ne_110m_admin_0_countries.geojson");
    if (!response.ok) throw new Error(`GeoJSON ${response.status}`);
    const countries = await response.json();
    const measureWidth = () => Math.min(stage?.clientWidth || 600, 900);
    const size = measureWidth();
    // Keep the globe fully visible in narrow panels instead of cropping its sides.
    const heightForWidth = (width) => Math.min(width, 500);
    const world = window.Globe()(container)
      .width(size)
      .height(heightForWidth(size))
      .backgroundColor("rgba(0,0,0,0)")
      .showAtmosphere(true)
      .atmosphereColor("#719BC1")
      .atmosphereAltitude(0.1)
      .polygonsData(countries.features)
      .polygonAltitude(0.006)
      .polygonCapColor((feature) => {
        const country = feature.properties?.ADMIN;
        if (country === "China" || country === "Indonesia") return "#C68A44";
        const palette = ["#728D9E", "#819AA8", "#93A9B2", "#698596"];
        const code = feature.properties?.ISO_A3 ?? country ?? "land";
        return palette[[...code].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length];
      })
      .polygonSideColor(() => "rgba(29,83,100,0.12)")
      .polygonStrokeColor(() => "rgba(231,239,241,0.5)")
      .polygonLabel((feature) => {
        const country = feature.properties?.ADMIN;
        if (country !== "China" && country !== "Indonesia") return "";
        return `<div class="globe-tooltip"><strong>${country === "China" ? "中国" : "印度尼西亚"}</strong><span>${country.toUpperCase()}</span></div>`;
      })
      .htmlElementsData(VISITED_COUNTRIES)
      .htmlLat("lat")
      .htmlLng("lng")
      .htmlAltitude(0.025)
      .htmlElement((place) => {
        const label = document.createElement("div");
        label.className = "globe-country-label";
        const [chinese, english] = place.label.split(" / ");
        label.innerHTML = `<strong>${chinese}</strong><span>${english}</span>`;
        return label;
      });

    world.globeMaterial().color.set("#24445D");
    world.globeMaterial().emissive.set("#172C43");
    world.globeMaterial().emissiveIntensity = 0.3;
    world.globeMaterial().shininess = 5;
    world.pointOfView({ lat: 24, lng: 110, altitude: 1.92 }, 0);

    const controls = world.controls();
    controls.enablePan = false;
    controls.minDistance = 180;
    controls.maxDistance = 430;
    controls.autoRotate = false;
    controls.enableZoom = false;
    const countryButtons = [...document.querySelectorAll("[data-globe-country]")];
    const clearCountrySelection = () => countryButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
    controls.addEventListener("start", clearCountrySelection);
    countryButtons.forEach((button) => {
      button.disabled = false;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        const place = VISITED_COUNTRIES.find((country) => country.country === button.dataset.globeCountry);
        if (!place) return;
        clearCountrySelection();
        button.setAttribute("aria-pressed", "true");
        world.pointOfView({ lat: place.lat, lng: place.lng, altitude: 1.92 }, reducedMotion ? 0 : 650);
      });
    });

    container.addEventListener("keydown", (event) => {
      const delta = event.key === "ArrowLeft" ? -8 : event.key === "ArrowRight" ? 8 : 0;
      if (!delta) return;
      event.preventDefault();
      clearCountrySelection();
      const view = world.pointOfView();
      world.pointOfView({ ...view, lng: view.lng + delta }, reducedMotion ? 0 : 260);
    });

    const resize = () => {
      if (!stage?.clientWidth) return;
      const next = measureWidth();
      world.width(next).height(heightForWidth(next));
    };
    new ResizeObserver(resize).observe(stage ?? container);
    stage?.classList.add("is-ready");
  } catch (error) {
    console.warn("Travel globe unavailable", error);
    showError();
  }
};

const globeContainer = document.querySelector("#travel-globe");
if (globeContainer) initTravelGlobe(globeContainer);

const rewindGeoJson = (collection) => {
  const reversePolygon = (polygon) => polygon.map((ring) => [...ring].reverse());
  collection.features.forEach((feature) => {
    if (feature.geometry?.type === "Polygon") {
      feature.geometry.coordinates = reversePolygon(feature.geometry.coordinates);
    } else if (feature.geometry?.type === "MultiPolygon") {
      feature.geometry.coordinates = feature.geometry.coordinates.map(reversePolygon);
    }
  });
  return collection;
};

const initChinaMap = async (svgElement) => {
  const stage = svgElement.closest(".china-map-stage");
  const status = stage?.querySelector(".china-map-status");
  const tooltip = stage?.querySelector(".china-map-tooltip");

  const showError = () => {
    stage?.classList.add("has-error");
    if (status) status.textContent = "中国地图暂时没有连上线，请稍后刷新再看。";
  };

  if (!window.d3) {
    showError();
    return;
  }

  try {
    const response = await fetch("assets/maps/china-provinces.json?v=1");
    if (!response.ok) throw new Error(`China GeoJSON ${response.status}`);
    const china = rewindGeoJson(await response.json());
    const d3 = window.d3;
    const svg = d3.select(svgElement);
    const projection = d3.geoMercator().fitExtent([[38, 32], [682, 590]], china);
    const path = d3.geoPath(projection);
    const priorityLabels = new Set(["北京", "上海", "西安", "长沙", "深圳", "昆明"]);

    svg.append("g")
      .attr("class", "china-provinces")
      .selectAll("path")
      .data(china.features)
      .join("path")
      .attr("class", "china-province")
      .attr("d", path);

    const nodes = svg.append("g")
      .attr("class", "china-destinations")
      .selectAll("g")
      .data(CHINA_DESTINATIONS)
      .join("g")
      .attr("class", (place) => `china-destination china-destination--${place.accent}`)
      .attr("transform", (place) => `translate(${projection([place.lng, place.lat]).join(",")})`)
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-pressed", "false")
      .attr("aria-label", (place) => `${place.region}，${place.name}`);

    nodes.append("circle").attr("class", "destination-hit").attr("r", 13);
    nodes.append("circle").attr("r", (place) => place.accent === "home" ? 6.5 : 4.5);
    nodes.filter((place) => priorityLabels.has(place.name))
      .append("text")
      .attr("x", 9)
      .attr("y", -8)
      .text((place) => place.name);

    const destinationSelect = document.querySelector("#destination-select");
    const destinationDetail = document.querySelector("#destination-detail");
    const selectDestination = (place) => {
      if (tooltip) tooltip.hidden = true;
      nodes.classed("is-selected", (point) => point.name === place.name)
        .attr("aria-pressed", (point) => String(point.name === place.name));
      if (destinationSelect) destinationSelect.value = place.name;
      if (destinationDetail) destinationDetail.textContent = `${place.name} · ${place.region} / ${place.lat.toFixed(2)}°N, ${place.lng.toFixed(2)}°E`;
    };
    if (destinationSelect) {
      destinationSelect.replaceChildren(...CHINA_DESTINATIONS.map((place) => new Option(`${place.name} · ${place.region}`, place.name)));
      destinationSelect.disabled = false;
      destinationSelect.addEventListener("change", () => {
        const place = CHINA_DESTINATIONS.find((point) => point.name === destinationSelect.value);
        if (place) selectDestination(place);
      });
      selectDestination(CHINA_DESTINATIONS.find((place) => place.name === "深圳"));
    }
    const showTooltip = (event, place) => {
      if (!tooltip) return;
      const [x, y] = projection([place.lng, place.lat]);
      tooltip.innerHTML = `<strong>${place.name}</strong><span>${place.region}</span>`;
      tooltip.hidden = false;
      const mapBounds = svgElement.getBoundingClientRect();
      const stageBounds = stage.getBoundingClientRect();
      const left = mapBounds.left - stageBounds.left + (x / 720) * mapBounds.width;
      const top = mapBounds.top - stageBounds.top + (y / 620) * mapBounds.height;
      const halfWidth = tooltip.offsetWidth / 2;
      tooltip.style.left = `${Math.min(stageBounds.width - halfWidth, Math.max(halfWidth, left))}px`;
      tooltip.style.top = `${Math.max(tooltip.offsetHeight * 1.15, top)}px`;
    };
    const hideTooltip = () => { if (tooltip) tooltip.hidden = true; };
    nodes
      .on("mouseenter focus", showTooltip)
      .on("mouseleave blur", hideTooltip)
      .on("click", (event, place) => { selectDestination(place); showTooltip(event, place); })
      .on("keydown", (event, place) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectDestination(place);
        }
        if (event.key === "Escape") hideTooltip();
      });

    stage?.classList.add("is-ready");
  } catch (error) {
    console.warn("China travel map unavailable", error);
    showError();
  }
};

const chinaMap = document.querySelector("#china-map");
if (chinaMap) initChinaMap(chinaMap);

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
