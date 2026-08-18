#!/usr/bin/env node
/**
 * Build the 4 derived case-type masters from car-accident.html (the base),
 * and inject the shared 12-city geo JSON into ALL masters (base included).
 *   node build-masters.mjs
 * Every replacement is verified — the script throws if an expected string
 * is missing, so a stale base can't silently produce broken masters.
 * After this, bake city pages with: node generate-geo.mjs --all
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const BASE = resolve(DIR, "car-accident.html");

/* ---------------- shared geo data (single source of truth) ---------------- */
const SHARED = {
  phone: "+12139348686",
  phoneDisplay: "(213) 934-8686",
  stars: "4.9★",
  review: "★ 4.9/5 · 40 Google reviews",
  review_es: "★ 4.9/5 · 40 reseñas en Google",
  office: "Nozar Law, APC · 9171 Wilshire Blvd, Suite 500, Beverly Hills, CA 90210 · Free consult 24/7: (213) 934-8686",
  office_es: "Nozar Law, APC · 9171 Wilshire Blvd, Suite 500, Beverly Hills, CA 90210 · Consulta gratis 24/7: (213) 934-8686",
  sol: "In California you generally have two years from the crash to file — and claims against government entities (a city bus, a Metro vehicle, a dangerous road) require a formal claim within just six months. Evidence disappears far sooner: camera footage gets erased and witnesses move. The sooner Josh starts, the stronger your case.",
  sol_es: "En California generalmente tiene dos años desde el accidente para presentar su reclamo — y los reclamos contra entidades del gobierno (un autobús de la ciudad, un vehículo de Metro, una vía peligrosa) requieren un reclamo formal en solo seis meses. La evidencia desaparece mucho antes: los videos se borran y los testigos se mudan. Cuanto antes empiece Josh, más fuerte será su caso."
};

const CITIES = {
  "los-angeles":  { city: "Los Angeles",  es: "Los Ángeles",  serve: "Serving all of Los Angeles — Downtown to the Westside — from our Wilshire Blvd office.", serve_es: "Sirviendo a todo Los Ángeles — del Centro al Westside — desde nuestra oficina en Wilshire Blvd." },
  "beverly-hills":{ city: "Beverly Hills", serve: "Based at 9171 Wilshire Blvd — right here in Beverly Hills.", serve_es: "Con oficina en 9171 Wilshire Blvd — aquí mismo en Beverly Hills." },
  "glendale":     { city: "Glendale",     serve: "Serving Glendale, the Verdugos, and the 134/5 corridor from our Beverly Hills office.", serve_es: "Sirviendo a Glendale, los Verdugos y el corredor 134/5 desde nuestra oficina en Beverly Hills." },
  "burbank":      { city: "Burbank",      serve: "Serving Burbank and the Media District from our Beverly Hills office.", serve_es: "Sirviendo a Burbank y el Media District desde nuestra oficina en Beverly Hills." },
  "pasadena":     { city: "Pasadena",     serve: "Serving Pasadena and the western San Gabriel Valley from our Beverly Hills office.", serve_es: "Sirviendo a Pasadena y el oeste del Valle de San Gabriel desde nuestra oficina en Beverly Hills." },
  "van-nuys":     { city: "Van Nuys",     serve: "Serving Van Nuys and the heart of the San Fernando Valley.", serve_es: "Sirviendo a Van Nuys y el corazón del Valle de San Fernando." },
  "encino":       { city: "Encino",       serve: "Serving Encino, Sherman Oaks, and the Ventura Blvd corridor.", serve_es: "Sirviendo a Encino, Sherman Oaks y el corredor de Ventura Blvd." },
  "long-beach":   { city: "Long Beach",   serve: "Serving Long Beach, the 710 corridor, and the South Bay.", serve_es: "Sirviendo a Long Beach, el corredor de la 710 y el South Bay." },
  "downey":       { city: "Downey",       serve: "Serving Downey and the Gateway Cities.", serve_es: "Sirviendo a Downey y las Gateway Cities." },
  "norwalk":      { city: "Norwalk",      serve: "Serving Norwalk, Santa Fe Springs, and the Gateway Cities.", serve_es: "Sirviendo a Norwalk, Santa Fe Springs y las Gateway Cities." },
  "west-covina":  { city: "West Covina",  serve: "Serving West Covina and the eastern San Gabriel Valley.", serve_es: "Sirviendo a West Covina y el este del Valle de San Gabriel." },
  "pomona":       { city: "Pomona",       serve: "Serving Pomona and the Inland Valley — where the 10, 57, 60 and 71 meet.", serve_es: "Sirviendo a Pomona y el Inland Valley — donde se cruzan la 10, 57, 60 y 71." }
};

function buildGeoJson() {
  const geos = {
    default: {
      city: "", h1city: "California", h1city_es: " en California",
      ...SHARED,
      serve: "Serving all of Los Angeles County — and all of California — from our Beverly Hills office.",
      serve_es: "Sirviendo a todo el condado de Los Ángeles — y toda California — desde nuestra oficina en Beverly Hills."
    }
  };
  for (const [slug, c] of Object.entries(CITIES)) {
    geos[slug] = {
      city: c.city, h1city: c.city, h1city_es: " en " + (c.es || c.city),
      ...SHARED, serve: c.serve, serve_es: c.serve_es
    };
  }
  return JSON.stringify(geos);
}

/* ---------------- per-master replacement configs ---------------- */
const H1 = (pre, mid, post) => `<h1><span class="h1-pre">${pre}</span><em class="h1-city" data-geo="h1city">${mid}</em><span class="h1-post">${post}</span></h1>`;
const BASE_H1 = H1("Hurt in a ", "California", " Car Accident?");
const BASE_SUB = `<p class="hero-sub">Don't take the insurance company's first offer. Josh Nozar fights for the full value of your case — and you pay nothing unless he wins.</p>`;
const BASE_ES_H1_OPS = `["t", ".h1-pre", 0, "¿Lesionado en un accidente de auto"], ["t", ".h1-post", 0, "?"]`;
const BASE_ES_SUB_OP = `["t", ".hero-sub", 0, "No acepte la primera oferta de la aseguradora. Josh Nozar pelea por el valor completo de su caso — y usted no paga nada a menos que él gane."]`;
const OPS_TAIL = `["t", ".bar .btn-navy", 0, "Obtener Mi Evaluación"]]}`;
const MICHELLE = `<div class="tcard"><div class="tstars" aria-label="5 out of 5 stars">★★★★★</div><p>"Nozar Law represented me in my car accident case. He was very attentive and called me often with updates about my case. He would listen to my needs and make sure that I was getting the best care and the best doctors possible."</p><div class="tby"><span class="gdot">G</span>Michelle Y · Google Review</div></div>`;
const JESSE = `<div class="tcard"><div class="tstars" aria-label="5 out of 5 stars">★★★★★</div><p>"When I thought all hope was lost… Josh Nozar not only took my case. He dominated it. Extremely professional through the whole experience and was easy to talk to or get ahold of."</p><div class="tby"><span class="gdot">G</span>Jesse Mendibles · Google Review</div></div>`;

const faqDetails = (q, a) => `<details><summary>${q}</summary><p>${a}</p></details>\n    `;

const MASTERS = {
  "personal-injury": {
    title: "Personal Injury Lawyer | Free Case Review 24/7 | Nozar Law, Beverly Hills",
    desc: "Injured in an accident? Josh Nozar fights the insurance company for every dollar you're owed. Free case review 24/7 · No fee unless we win · 4.9★ on Google · Se habla español.",
    ogTitle: "Personal Injury Lawyer | Nozar Law",
    h1: H1("Hurt in ", "California", "? Get What You're Owed."),
    sub: `<p class="hero-sub">Car crash, fall, dog bite, or worse — the insurance company's job is to underpay you. Josh Nozar's job is to stop them. You pay nothing unless he wins.</p>`,
    esTitle: "Abogado de Lesiones Personales | Evaluación Gratis 24/7 | Nozar Law",
    esH1Ops: `["t", ".h1-pre", 0, "¿Lesionado"], ["t", ".h1-post", 0, "? Recupere lo que le deben."]`,
    esSubOp: `["t", ".hero-sub", 0, "Choque, caída, mordedura de perro o algo peor — el trabajo de la aseguradora es pagarle de menos. El trabajo de Josh Nozar es impedirlo. Usted no paga nada a menos que él gane."]`,
    jsTitle: " Personal Injury Lawyer | Free Case Review 24/7 | Nozar Law",
    faqs: [
      ["What types of injury cases does Josh take?", "Car, motorcycle, truck, rideshare, bicycle, bus, and pedestrian accidents, dog bites, and injuries on dangerous property (premises liability). If someone else's negligence hurt you, call — if it isn't a case Josh can take, he'll tell you straight and point you in the right direction.",
       "¿Qué tipos de casos de lesiones toma Josh?", "Accidentes de auto, moto, camión, viaje compartido (Uber/Lyft), bicicleta, autobús y peatones, mordeduras de perro y lesiones en propiedades peligrosas. Si la negligencia de otra persona lo lesionó, llame — y si no es un caso que Josh pueda tomar, se lo dirá con franqueza y lo orientará."],
      ["Do I really need a lawyer for a smaller injury?", "Smaller cases are where insurers underpay most aggressively, because they assume no lawyer will push back. A free review takes minutes and tells you what your claim is actually worth — then you decide.",
       "¿De verdad necesito un abogado para una lesión menor?", "En los casos pequeños es donde las aseguradoras más pagan de menos, porque asumen que ningún abogado va a reclamar. Una evaluación gratuita toma minutos y le dice cuánto vale realmente su reclamo — después usted decide."]
    ]
  },
  "motorcycle-accident": {
    title: "Motorcycle Accident Lawyer | Free Case Review 24/7 | Nozar Law, Beverly Hills",
    desc: "Hurt riding? Adjusters blame riders — Josh Nozar makes them pay what the case is worth. Free case review 24/7 · No fee unless we win · 4.9★ on Google · Se habla español.",
    ogTitle: "Motorcycle Accident Lawyer | Nozar Law",
    h1: H1("Hurt in a ", "California", " Motorcycle Crash?"),
    sub: `<p class="hero-sub">Adjusters are trained to blame the rider and lowball the claim. Josh Nozar makes them treat your crash like the serious case it is — and you pay nothing unless he wins.</p>`,
    esTitle: "Abogado de Accidentes de Moto | Evaluación Gratis 24/7 | Nozar Law",
    esH1Ops: `["t", ".h1-pre", 0, "¿Lesionado en un accidente de moto"], ["t", ".h1-post", 0, "?"]`,
    esSubOp: `["t", ".hero-sub", 0, "Los ajustadores están entrenados para culpar al motociclista y ofrecer menos. Josh Nozar los obliga a tratar su choque como el caso serio que es — y usted no paga nada a menos que él gane."]`,
    jsTitle: " Motorcycle Accident Lawyer | Free Case Review 24/7 | Nozar Law",
    faqs: [
      ["The adjuster is blaming me because I was on a motorcycle. Is my case dead?", "No. Rider bias is real — adjusters count on it — but it isn't the law. California's pure comparative negligence rule means you can recover even if you share fault, and the evidence (skid marks, camera footage, witness accounts) usually tells a different story than the adjuster's version. Don't accept blame before a free review.",
       "El ajustador me culpa por andar en moto. ¿Mi caso está perdido?", "No. El prejuicio contra motociclistas es real — los ajustadores cuentan con él — pero no es la ley. La regla de negligencia comparativa pura de California le permite recuperar aunque comparta culpa, y la evidencia (marcas de frenado, videos, testigos) suele contar una historia distinta a la versión del ajustador. No acepte la culpa antes de una evaluación gratis."],
      ["I was lane splitting. Can I still recover?", "Yes. Lane splitting is legal in California — the first state to formally legalize it. The insurer may still argue it was done unsafely, which is exactly the fight an experienced injury lawyer takes on. Get your facts reviewed before you give any statement.",
       "Iba entre carriles (lane splitting). ¿Aún puedo recuperar?", "Sí. Circular entre carriles es legal en California — el primer estado en legalizarlo formalmente. La aseguradora puede alegar que fue inseguro, y esa es exactamente la pelea que un abogado con experiencia asume. Revise sus hechos antes de dar cualquier declaración."]
    ]
  },
  "truck-accident": {
    title: "Truck Accident Lawyer | Free Case Review 24/7 | Nozar Law, Beverly Hills",
    desc: "Hit by a commercial truck? Their insurer has a team on it already. Josh Nozar levels the field. Free case review 24/7 · No fee unless we win · 4.9★ on Google · Se habla español.",
    ogTitle: "Truck Accident Lawyer | Nozar Law",
    h1: H1("Hit by a Truck in ", "California", "?"),
    sub: `<p class="hero-sub">Trucking companies put rapid-response teams on a crash within hours. Josh Nozar moves just as fast — preserving the evidence and pursuing every policy that owes you. No fee unless he wins.</p>`,
    esTitle: "Abogado de Accidentes de Camión | Evaluación Gratis 24/7 | Nozar Law",
    esH1Ops: `["t", ".h1-pre", 0, "¿Golpeado por un camión"], ["t", ".h1-post", 0, "?"]`,
    esSubOp: `["t", ".hero-sub", 0, "Las compañías de camiones ponen equipos de respuesta rápida en el lugar del choque en cuestión de horas. Josh Nozar actúa igual de rápido — preservando la evidencia y persiguiendo cada póliza que le debe. Sin honorarios a menos que gane."]`,
    jsTitle: " Truck Accident Lawyer | Free Case Review 24/7 | Nozar Law",
    faqs: [
      ["Who can be held responsible in a truck accident?", "Often more than just the driver: the trucking company, the cargo loader, the maintenance contractor, even the truck's manufacturer — each with its own insurance policy. Finding every liable party (and every policy) is a big part of why truck cases settle for more with a lawyer.",
       "¿Quién puede ser responsable en un accidente de camión?", "A menudo más que el conductor: la compañía de transporte, quien cargó la mercancía, el contratista de mantenimiento e incluso el fabricante del camión — cada uno con su propia póliza. Encontrar a cada responsable (y cada póliza) es gran parte de por qué los casos de camión se resuelven por más con un abogado."],
      ["What makes truck cases different from car cases?", "Commercial trucks are governed by federal safety rules — hours-of-service logs, inspection records, and onboard “black box” data. That evidence can prove fatigue or negligence, but carriers only have to keep some of it for months. Josh sends preservation letters immediately so it can't quietly disappear.",
       "¿Qué hace diferentes a los casos de camión?", "Los camiones comerciales se rigen por reglas federales de seguridad — registros de horas de servicio, inspecciones y datos de la «caja negra». Esa evidencia puede probar fatiga o negligencia, pero las empresas solo deben conservar parte de ella por meses. Josh envía cartas de preservación de inmediato para que no desaparezca."]
    ]
  },
  "rideshare-accident": {
    title: "Rideshare Accident Lawyer | Free Case Review 24/7 | Nozar Law, Beverly Hills",
    desc: "Hurt in an Uber or Lyft — as a passenger, driver, or in another car? Up to $1M in coverage may apply. Free case review 24/7 · No fee unless we win · 4.9★ on Google.",
    ogTitle: "Rideshare Accident Lawyer | Nozar Law",
    h1: H1("Hurt Riding an Uber or Lyft in ", "California", "?"),
    sub: `<p class="hero-sub">Passenger, rideshare driver, or hit by one — Uber and Lyft carry up to $1 million in coverage, and their insurers still lowball. Josh Nozar gets you the full value. No fee unless he wins.</p>`,
    esTitle: "Abogado de Accidentes de Uber y Lyft | Evaluación Gratis 24/7 | Nozar Law",
    esH1Ops: `["t", ".h1-pre", 0, "¿Lesionado en un Uber o Lyft"], ["t", ".h1-post", 0, "?"]`,
    esSubOp: `["t", ".hero-sub", 0, "Pasajero, conductor de viaje compartido o golpeado por uno — Uber y Lyft tienen hasta $1 millón en cobertura, y sus aseguradoras aún así ofrecen menos. Josh Nozar consigue el valor completo. Sin honorarios a menos que gane."]`,
    jsTitle: " Rideshare Accident Lawyer | Free Case Review 24/7 | Nozar Law",
    faqs: [
      ["Does Uber or Lyft's $1 million policy cover my crash?", "It depends on what the app showed at the moment of the crash. With a passenger aboard or a ride accepted, up to $1 million in liability coverage generally applies; app-on waiting periods carry lower limits; app-off falls to the driver's personal policy. Insurers exploit that confusion to point fingers at each other — Josh pins down which coverage applies and pursues it.",
       "¿La póliza de $1 millón de Uber o Lyft cubre mi choque?", "Depende de lo que mostraba la aplicación en el momento del choque. Con un pasajero a bordo o un viaje aceptado, generalmente aplican hasta $1 millón de cobertura de responsabilidad; con la app encendida en espera, los límites son menores; con la app apagada, aplica la póliza personal del conductor. Las aseguradoras usan esa confusión para culparse entre sí — Josh determina qué cobertura aplica y la persigue."],
      ["I was a passenger. Do I have to sue my driver personally?", "Almost never in practice. Passenger claims are generally paid by the rideshare company's insurance, or the other driver's — not out of your driver's pocket. As the passenger, you're rarely at fault, which usually makes yours the strongest claim in the crash.",
       "Yo era pasajero. ¿Tengo que demandar a mi conductor personalmente?", "Casi nunca en la práctica. Los reclamos de pasajeros generalmente los paga el seguro de la empresa de viajes compartidos, o el del otro conductor — no el bolsillo de su conductor. Como pasajero, usted rara vez tiene culpa, lo que suele hacer del suyo el reclamo más fuerte del choque."]
    ]
  }
};

/* ---------------- build ---------------- */
let base = readFileSync(BASE, "utf8");

function replaceOnce(html, from, to, label) {
  const n = html.split(from).length - 1;
  if (n !== 1) throw new Error(`expected exactly 1 match for [${label}], found ${n}`);
  return html.replace(from, to);
}

// 1) inject shared geo JSON into the base (idempotent — replaces whatever block is there)
base = base.replace(
  /(<script type="application\/json" id="geo-data">)[\s\S]*?(<\/script>)/,
  `$1\n${buildGeoJson()}\n$2`
);
writeFileSync(BASE, base);
console.log("geo-data injected → car-accident.html (12 cities + default)");

// 2) derive the other masters
for (const [slug, m] of Object.entries(MASTERS)) {
  let out = base;
  out = replaceOnce(out, "<title>Car Accident Lawyer | Free Case Review 24/7 | Nozar Law, Beverly Hills</title>", `<title>${m.title}</title>`, "title");
  out = replaceOnce(out,
    `<meta name="description" content="Injured in a car accident? Josh Nozar fights the insurance company for every dollar you're owed. Free case review 24/7 · No fee unless we win · 4.9★ on Google · Se habla español.">`,
    `<meta name="description" content="${m.desc}">`, "meta desc");
  out = replaceOnce(out, `<meta property="og:title" content="Car Accident Lawyer | Nozar Law">`, `<meta property="og:title" content="${m.ogTitle}">`, "og:title");
  out = replaceOnce(out, BASE_H1, m.h1, "h1");
  out = replaceOnce(out, BASE_SUB, m.sub, "hero-sub");
  out = replaceOnce(out, `"title": "Abogado de Accidentes de Auto | Evaluación Gratis 24/7 | Nozar Law"`, `"title": "${m.esTitle}"`, "es title");
  out = replaceOnce(out, BASE_ES_H1_OPS, m.esH1Ops, "es h1 ops");
  out = replaceOnce(out, BASE_ES_SUB_OP, m.esSubOp, "es sub op");
  out = replaceOnce(out, `document.title = g.city + " Car Accident Lawyer | Free Case Review 24/7 | Nozar Law";`, `document.title = g.city + "${m.jsTitle}";`, "js title");
  out = replaceOnce(out, `var e = { event: ev, case_type: "car-accident", geo: slug };`, `var e = { event: ev, case_type: "${slug}", geo: slug };`, "track case_type");
  out = replaceOnce(out, `case_type:"car-accident", geo:slug, page:location.href`, `case_type:"${slug}", geo:slug, page:location.href`, "payload case_type");
  out = replaceOnce(out, `"&ct=car-accident"`, `"&ct=${slug}"`, "redirect ct");
  out = replaceOnce(out, MICHELLE, JESSE, "testimonial swap");
  out = replaceOnce(out, `["lt", ".tby", 0, "Michelle Y · Reseña de Google"]`, `["lt", ".tby", 0, "Jesse Mendibles · Reseña de Google"]`, "es tby swap");

  // extra FAQs (EN html + ES ops appended at indices 6 and 7)
  let faqHtml = "";
  const extraOps = [];
  m.faqs.forEach(([q, a, qEs, aEs], i) => {
    faqHtml += faqDetails(q, a);
    extraOps.push(JSON.stringify(["t", ".faq summary", 6 + i, qEs]));
    extraOps.push(JSON.stringify(["t", ".faq details p", 6 + i, aEs]));
  });
  out = replaceOnce(out, "<!-- faq-extra -->", faqHtml + "<!-- faq-extra -->", "faq insert");
  out = replaceOnce(out, OPS_TAIL, OPS_TAIL.slice(0, -2) + ", " + extraOps.join(", ") + "]}", "es faq ops");

  const dest = resolve(DIR, `${slug}.html`);
  writeFileSync(dest, out);
  console.log(`built ${slug}.html`);
}
console.log("done — now run: node generate-geo.mjs --all");
