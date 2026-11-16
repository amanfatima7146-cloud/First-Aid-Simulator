/* ============================================================
   First-Aid Decision Tree Simulator
   ------------------------------------------------------------
   All scenarios live in the SCENARIOS object below as data.
   To add a new emergency, add an entry with a `start` node and
   a set of `nodes`. Node types:
     - question  : asks something, offers `choices`
     - action    : lists `steps`, then continues via `next` (or `choices`)
     - emergency : urgent "call 911" style node
     - end       : final summary

   IMPORTANT: Content is a general educational summary of commonly
   published guidance (Red Cross / AHA / NHS style). Have it
   reviewed by a qualified clinician and adapt it to your region
   before releasing it to real users.
   ============================================================ */

const SCENARIOS = {
  burns: {
    icon: "01",
    title: "Burns",
    start: "burn_start",
    nodes: {
      burn_start: {
        type: "question",
        title: "Make sure the scene is safe",
        text: "Is the person still in contact with the heat source, flames, electricity, or chemicals?",
        choices: [
          { label: "Yes, still in contact", next: "burn_stop_source" },
          { label: "No, the source is removed", next: "burn_type" },
        ],
      },
      burn_stop_source: {
        type: "action",
        title: "Stop the burning process safely",
        steps: [
          "Do not put yourself at risk. For electrical burns, turn off the power at the source before touching the person.",
          "If clothing is on fire: Stop, Drop, and Roll (or smother flames with a blanket).",
          "For chemical burns: brush off dry chemical, remove contaminated clothing, then rinse with plenty of running water.",
        ],
        next: "burn_type",
      },
      burn_type: {
        type: "question",
        title: "What kind of burn is it?",
        text: "Pick the best match.",
        choices: [
          { label: "Electrical or chemical burn", next: "burn_call" },
          { label: "Heat/scald burn", next: "burn_severity" },
        ],
      },
      burn_severity: {
        type: "question",
        title: "How severe does it look?",
        text: "Check for any of these: larger than the person's palm, on face / hands / feet / genitals / over a joint, deep (white, leathery, charred), person is an infant or older adult, or there are breathing problems.",
        choices: [
          { label: "Yes, one or more apply", next: "burn_call" },
          { label: "No, small and red / mild blistering", next: "burn_cool" },
        ],
      },
      burn_call: {
        type: "emergency",
        title: "Call 911 (or your local emergency number)",
        steps: [
          "Call emergency services now.",
          "Check breathing. If the person stops breathing, begin CPR if you are trained.",
          "Continue to the cooling and covering steps while you wait.",
        ],
        next: "burn_cool",
      },
      burn_cool: {
        type: "action",
        title: "Cool the burn",
        steps: [
          "Hold the burn under cool (not ice-cold) running water for about 20 minutes.",
          "Gently remove rings, watches, and tight clothing near the burn before swelling starts. Do not pull off anything stuck to the skin.",
          "Do NOT use ice, butter, oils, toothpaste, or home remedies.",
          "For chemical burns, keep rinsing until help arrives (or at least 20 minutes).",
        ],
        next: "burn_cover",
      },
      burn_cover: {
        type: "action",
        title: "Cover and protect",
        steps: [
          "Loosely cover with a clean, non-fluffy dressing or cling film (laid lengthwise, not wrapped around).",
          "Do not pop blisters.",
          "Keep the person warm (but not the burn area) and watch for shock: pale, clammy, faint, fast breathing.",
          "Pain relief such as acetaminophen/paracetamol may be used for minor burns if the person can safely take it.",
        ],
        next: "burn_end",
      },
      burn_end: {
        type: "end",
        title: "Burn care summary",
        text: "Cool, cover, and get medical help for anything beyond a small, mild burn. Seek care if a minor burn shows signs of infection (increasing pain, pus, spreading redness, fever) or isn't healing.",
      },
    },
  },

  allergy: {
    icon: "02",
    title: "Allergic Reaction",
    start: "al_start",
    nodes: {
      al_start: {
        type: "question",
        title: "Check for severe symptoms",
        text: "Does the person have ANY of these after a likely trigger (food, sting, medication)? Trouble breathing or wheezing, swelling of the tongue/lips/throat, hoarse voice, dizziness or fainting, widespread hives with vomiting or stomach pain.",
        choices: [
          { label: "Yes, severe symptoms", next: "al_epi_available" },
          { label: "No, mild (some hives, itchy, runny nose)", next: "al_mild" },
        ],
      },
      al_epi_available: {
        type: "question",
        title: "Is an epinephrine auto-injector available?",
        text: "Look for an EpiPen, Auvi-Q, or similar device belonging to the person.",
        choices: [
          { label: "Yes", next: "al_use_epi" },
          { label: "No / not sure", next: "al_call_only" },
        ],
      },
      al_use_epi: {
        type: "emergency",
        title: "Use epinephrine NOW, then call 911",
        steps: [
          "Remove the safety cap. Firmly press the tip into the middle of the OUTER thigh (can go through clothing).",
          "Hold in place as the device instructs (commonly 3 seconds for EpiPen, 2 for Auvi-Q), then remove and massage the area.",
          "Call 911 and say it is anaphylaxis. Note the time of the injection.",
          "Everyone who gets epinephrine needs emergency care, even if symptoms improve.",
        ],
        next: "al_position",
      },
      al_call_only: {
        type: "emergency",
        title: "Call 911 immediately",
        steps: [
          "Call emergency services and say the person may be having anaphylaxis.",
          "Ask others nearby whether anyone has an auto-injector. Do not delay the call.",
          "Do not give food or drink.",
        ],
        next: "al_position",
      },
      al_position: {
        type: "action",
        title: "Position and monitor",
        steps: [
          "Lay the person flat with legs raised if they feel faint.",
          "If they are struggling to breathe, let them sit up. If vomiting or unconscious, place them on their side (recovery position).",
          "Do not make them stand or walk.",
          "Remove the trigger if possible (e.g., a bee stinger: scrape it out, don't squeeze).",
        ],
        next: "al_second_dose",
      },
      al_second_dose: {
        type: "question",
        title: "5 to 15 minutes later: any improvement?",
        text: "Check breathing, swelling, and alertness.",
        choices: [
          { label: "No improvement or getting worse", next: "al_repeat" },
          { label: "Improving", next: "al_wait" },
          { label: "Person stopped breathing / unresponsive", next: "al_cpr" },
        ],
      },
      al_repeat: {
        type: "action",
        title: "Give a second dose if available",
        steps: [
          "If symptoms are not improving after 5 to 15 minutes and a second auto-injector is available, use it in the other thigh.",
          "Keep the person lying down and keep emergency services on the way.",
        ],
        next: "al_wait",
      },
      al_cpr: {
        type: "emergency",
        title: "Start CPR if you are trained",
        steps: [
          "Confirm 911 has been called.",
          "Begin chest compressions (about 100 to 120 per minute, 5 to 6 cm / 2 inches deep for adults) and use an AED if available.",
          "Continue until help arrives or the person recovers.",
        ],
        next: "al_end",
      },
      al_wait: {
        type: "action",
        title: "Stay until help arrives",
        steps: [
          "Stay with the person and keep watching their breathing.",
          "Symptoms can return hours later. Emergency evaluation is still needed.",
          "Tell responders the trigger (if known) and the time epinephrine was given.",
        ],
        next: "al_end",
      },
      al_mild: {
        type: "action",
        title: "Mild reaction care",
        steps: [
          "Move away from the trigger.",
          "An oral antihistamine may relieve itching and hives if the person can swallow safely.",
          "Watch closely for 1 to 2 hours. If ANY severe symptom appears, go back and treat as anaphylaxis.",
          "Contact a doctor, especially if this is a new reaction.",
        ],
        next: "al_end",
      },
      al_end: {
        type: "end",
        title: "Allergic reaction summary",
        text: "Severe reaction: epinephrine, call 911, lie down, monitor. Follow up with an allergist and make sure the person carries their auto-injector.",
      },
    },
  },

  choking: {
    icon: "03",
    title: "Choking",
    start: "ch_start",
    nodes: {
      ch_start: {
        type: "question",
        title: "Who is choking?",
        text: "The technique differs by age.",
        choices: [
          { label: "Adult or child (over 1 year)", next: "ch_adult_check" },
          { label: "Infant (under 1 year)", next: "ch_infant_check" },
        ],
      },
      ch_adult_check: {
        type: "question",
        title: "Can they cough, speak, or breathe?",
        text: "Ask: \"Are you choking?\" A person with a partial blockage can usually cough forcefully or talk.",
        choices: [
          { label: "Yes, coughing forcefully", next: "ch_encourage" },
          { label: "No, cannot cough, speak, or breathe", next: "ch_adult_call" },
        ],
      },
      ch_encourage: {
        type: "action",
        title: "Encourage coughing",
        steps: [
          "Stay with them and encourage strong coughing.",
          "Do not slap their back or give water while they can still cough.",
          "If coughing stops, or they cannot breathe or talk, treat as severe choking.",
        ],
        next: "ch_adult_check",
      },
      ch_adult_call: {
        type: "emergency",
        title: "Severe choking: act fast",
        steps: [
          "Shout for help and have someone call 911. If you are alone, start the steps below first.",
        ],
        next: "ch_adult_thrusts",
      },
      ch_adult_thrusts: {
        type: "action",
        title: "Back blows and abdominal thrusts",
        steps: [
          "Stand behind them (kneel for a small child). Lean them forward.",
          "Give 5 firm back blows between the shoulder blades with the heel of your hand.",
          "Then give 5 abdominal thrusts: fist just above the navel, other hand over it, pull sharply inward and upward.",
          "Pregnant or very large person: use chest thrusts instead of abdominal thrusts.",
          "Repeat 5 back blows and 5 thrusts until the object comes out or the person becomes unresponsive.",
        ],
        next: "ch_adult_outcome",
      },
      ch_adult_outcome: {
        type: "question",
        title: "What happened?",
        choices: [
          { label: "Object came out and they are breathing", next: "ch_recovered" },
          { label: "Person became unresponsive", next: "ch_unresponsive" },
        ],
      },
      ch_unresponsive: {
        type: "emergency",
        title: "Unresponsive: start CPR",
        steps: [
          "Lower them carefully to the ground and make sure 911 has been called.",
          "Begin CPR with chest compressions (about 100 to 120 per minute).",
          "Each time you open the airway for breaths, look in the mouth. Remove an object only if you can see it. Never do blind finger sweeps.",
          "Use an AED as soon as one arrives. Continue until help takes over.",
        ],
        next: "ch_recovered",
      },
      ch_infant_check: {
        type: "question",
        title: "Can the infant cry, cough, or breathe?",
        choices: [
          { label: "Yes, crying or coughing strongly", next: "ch_infant_watch" },
          { label: "No: silent, weak, or blue", next: "ch_infant_call" },
        ],
      },
      ch_infant_watch: {
        type: "action",
        title: "Monitor closely",
        steps: [
          "Let the infant cough. Do not put fingers in the mouth.",
          "If crying or coughing stops or breathing becomes difficult, treat as severe choking.",
        ],
        next: "ch_infant_check",
      },
      ch_infant_call: {
        type: "emergency",
        title: "Severe infant choking",
        steps: ["Have someone call 911. If alone, begin the steps below first."],
        next: "ch_infant_steps",
      },
      ch_infant_steps: {
        type: "action",
        title: "5 back blows and 5 chest thrusts",
        steps: [
          "Place the infant face-down along your forearm, head lower than the body, supporting the jaw. Rest your arm on your thigh.",
          "Give 5 firm back blows between the shoulder blades with the heel of your hand.",
          "Turn the infant face-up (support head and neck). Give 5 chest thrusts: two fingers on the center of the breastbone just below the nipple line, pressing about 4 cm (1.5 inches).",
          "Do NOT use abdominal thrusts on an infant.",
          "Repeat until the object comes out or the infant becomes unresponsive.",
        ],
        next: "ch_infant_outcome",
      },
      ch_infant_outcome: {
        type: "question",
        title: "What happened?",
        choices: [
          { label: "Object came out and infant is breathing", next: "ch_recovered" },
          { label: "Infant became unresponsive", next: "ch_infant_cpr" },
        ],
      },
      ch_infant_cpr: {
        type: "emergency",
        title: "Start infant CPR",
        steps: [
          "Ensure 911 is called.",
          "Give 30 chest compressions (two fingers, about 4 cm deep) then 2 gentle breaths if trained.",
          "Look in the mouth before breaths; remove only objects you can see.",
          "Continue until help arrives.",
        ],
        next: "ch_recovered",
      },
      ch_recovered: {
        type: "end",
        title: "Choking summary",
        text: "Anyone who needed back blows, thrusts, or CPR should be checked by a medical professional afterward, even if they seem fine. Thrusts can cause internal injury.",
      },
    },
  },

  bleeding: {
    icon: "04",
    title: "Severe Bleeding",
    start: "bl_start",
    nodes: {
      bl_start: {
        type: "question",
        title: "How serious is the bleeding?",
        text: "Spurting blood, blood soaking through bandages, or a pool of blood is life-threatening.",
        choices: [
          { label: "Severe: spurting or heavy", next: "bl_call" },
          { label: "Minor: oozing, small cut or scrape", next: "bl_minor" },
        ],
      },
      bl_call: {
        type: "emergency",
        title: "Call 911 and put on gloves if available",
        steps: [
          "Call emergency services (or have someone do it).",
          "Use gloves or a barrier (plastic bag) if possible. Avoid contact with blood.",
        ],
        next: "bl_pressure",
      },
      bl_pressure: {
        type: "action",
        title: "Apply firm, direct pressure",
        steps: [
          "Press a clean cloth or dressing firmly on the wound with both hands.",
          "Do not lift to check. If blood soaks through, add more material on top and keep pressing.",
          "Have the person lie down and raise the injured limb if no fracture is suspected.",
          "Do not remove an embedded object. Pad around it and press around it.",
        ],
        next: "bl_controlled",
      },
      bl_controlled: {
        type: "question",
        title: "Is the bleeding stopping?",
        choices: [
          { label: "Yes, slowing or stopped", next: "bl_bandage" },
          { label: "No, limb bleeding is still life-threatening", next: "bl_tourniquet" },
        ],
      },
      bl_tourniquet: {
        type: "emergency",
        title: "Limb only: consider a tourniquet",
        steps: [
          "Apply a commercial tourniquet 5 to 8 cm (2 to 3 inches) above the wound, never over a joint.",
          "Tighten until the bleeding stops. This is painful but necessary.",
          "Note the time applied and tell responders. Do not loosen or remove it.",
        ],
        next: "bl_shock",
      },
      bl_bandage: {
        type: "action",
        title: "Secure the dressing",
        steps: [
          "Wrap a firm bandage over the dressing, snug but not cutting off circulation.",
          "Do not remove soaked layers; add more on top.",
        ],
        next: "bl_shock",
      },
      bl_shock: {
        type: "action",
        title: "Treat for shock until help arrives",
        steps: [
          "Keep the person lying down and warm with a blanket.",
          "Do not give food or drink.",
          "Monitor breathing and alertness. Be ready to start CPR if they become unresponsive and stop breathing normally.",
        ],
        next: "bl_end",
      },
      bl_minor: {
        type: "action",
        title: "Minor wound care",
        steps: [
          "Wash your hands, then apply gentle pressure with a clean cloth for several minutes.",
          "Rinse with clean running water; clean around the wound with mild soap.",
          "Cover with a sterile bandage. Change it daily.",
          "Seek care for deep or gaping cuts, dirty wounds, animal bites, or if tetanus vaccination is out of date.",
        ],
        next: "bl_end",
      },
      bl_end: {
        type: "end",
        title: "Bleeding summary",
        text: "Pressure first, call for help early, and keep the person warm and still. Always get medical review for serious wounds.",
      },
    },
  },
};

/* ============================================================
   Engine
   ============================================================ */

const app = document.getElementById("app");

let state = { scenarioKey: null, nodeId: null, history: [] };

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  });
  [].concat(children).forEach((c) => c && node.appendChild(c));
  return node;
}

function showMenu() {
  state = { scenarioKey: null, nodeId: null, history: [] };
  app.replaceChildren();

  const grid = el("div", { class: "menu-grid" });
  Object.entries(SCENARIOS).forEach(([key, sc]) => {
    grid.appendChild(
      el("button", { onclick: () => startScenario(key) }, [
        el("span", { class: "icon", text: sc.icon }),
        document.createTextNode(sc.title),
      ])
    );
  });

  app.appendChild(
    el("section", { class: "card" }, [
      el("h2", { text: "What's the emergency?" }),
      el("p", {
        text: "Stay calm. Choose a situation, then answer each question to be guided through the steps. If someone is in immediate danger, call 911 first.",
      }),
      grid,
    ])
  );
}

function startScenario(key) {
  state = { scenarioKey: key, nodeId: SCENARIOS[key].start, history: [] };
  render();
}

function goTo(nextId) {
  state.history.push(state.nodeId);
  state.nodeId = nextId;
  render();
}

function goBack() {
  if (state.history.length === 0) return showMenu();
  state.nodeId = state.history.pop();
  render();
}

function render() {
  const sc = SCENARIOS[state.scenarioKey];
  const node = sc.nodes[state.nodeId];
  app.replaceChildren();

  const badgeText = { question: "Question", action: "Do this", emergency: "Urgent", end: "Summary" }[node.type];

  const card = el("section", { class: `card ${node.type}` }, [
    el("div", { class: "progress", text: `${sc.icon} / ${sc.title} / Step ${state.history.length + 1}` }),
    el("span", { class: "badge", text: badgeText }),
    el("h2", { text: node.title }),
  ]);

  if (node.text) card.appendChild(el("p", { text: node.text }));

  if (node.steps) {
    const ol = el("ol", { class: "steps" });
    node.steps.forEach((s) => ol.appendChild(el("li", { text: s })));
    card.appendChild(ol);
  }

  const choices = el("div", { class: "choices" });
  if (node.choices) {
    node.choices.forEach((c) =>
      choices.appendChild(el("button", { text: c.label, onclick: () => goTo(c.next) }))
    );
  } else if (node.next) {
    choices.appendChild(el("button", { text: "Done, next step →", onclick: () => goTo(node.next) }));
  } else {
    choices.appendChild(el("button", { text: "Choose another scenario", onclick: showMenu }));
    choices.appendChild(el("button", { text: "Restart this scenario", onclick: () => startScenario(state.scenarioKey) }));
  }
  card.appendChild(choices);

  card.appendChild(
    el("div", { class: "nav" }, [
      el("button", { text: "← Back", onclick: goBack }),
      el("button", { text: "Main menu", onclick: showMenu }),
    ])
  );

  app.appendChild(card);
  card.scrollIntoView({ behavior: "smooth", block: "start" });
}

showMenu();
