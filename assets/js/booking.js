/**
 * Objednávkový dotazník — sdílená logika pro revmatologii a PLDD.
 * Odeslání je lokální (ukázka); v produkci napojte na e-mail API / ordinanční software.
 */
(function () {
  const root = document.getElementById("booking-root");
  if (!root) return;

  const clinic = root.dataset.clinic === "gp" ? "gp" : "rheum";

  function clinicDisplayLabel() {
    return clinic === "gp"
      ? L("MUDr. Daniela Macháčková — praktický lékař", "MUDr. Daniela Macháčková — general practitioner")
      : L("MUDr. Stanislav Macháček — revmatologie", "MUDr. Stanislav Macháček — rheumatology");
  }

  function ojLang() {
    try {
      return localStorage.getItem("oj-lang") === "en" ? "en" : "cs";
    } catch (_) {
      return "cs";
    }
  }

  function L(cs, en) {
    return ojLang() === "en" ? en : cs;
  }

  const steps = [];

  steps.push({
    id: "consent",
    t: () => L("Úvod a souhlas", "Introduction & consent"),
    d: () =>
      L(
        "Vyplněním formuláře nám pomůžete připravit návštěvu. Údaje slouží výhradně pro zdravotní péči a domluvu termínu.",
        "Completing the form helps us prepare your visit. Data are used solely for healthcare and scheduling."
      ),
    render() {
      return `
        <div class="field">
          <label for="visit_type">${L("Typ návštěvy", "Visit type")}</label>
          <select id="visit_type" name="visit_type" required>
            <option value="">${L("— zvolte —", "— choose —")}</option>
            <option value="first">${L("První návštěva u specialisty / v ordinaci", "First visit with specialist / at practice")}</option>
            <option value="follow">${L("Opakovaná návštěva / kontrola", "Follow-up visit")}</option>
            <option value="acute">${L("Akutní stav (nutné odůvodnění níže)", "Acute problem (explain below)")}</option>
            <option value="results">${L("Konzultace výsledků vyšetření", "Discussing test results")}</option>
          </select>
        </div>
        <div class="field">
          <label for="urgency">${L("Preference termínu", "Scheduling preference")}</label>
          <select id="urgency" name="urgency" required>
            <option value="">${L("— zvolte —", "— choose —")}</option>
            <option value="standard">${L("Standardně do několika týdnů", "Standard — within a few weeks")}</option>
            <option value="sooner">${L("Dříve, pokud se uvolní termín", "Sooner if a slot opens")}</option>
            <option value="specific">${L("Mám konkrétní časové okno (uveďte níže)", "I have a specific window (state below)")}</option>
          </select>
        </div>
        <div class="field">
          <label for="preferred_slots">${L("Preferované dny / časy (nepovinné)", "Preferred days / times (optional)")}</label>
          <textarea id="preferred_slots" name="preferred_slots" placeholder="${L(
            "např. úterý odpoledne, vyhnout se pátečnímu ránu…",
            "e.g. Tuesday afternoon, avoid Friday morning…"
          )}"></textarea>
        </div>
        <fieldset>
          <legend>${L("Souhlas", "Consent")}</legend>
          <div class="check-list">
            <label class="check"><input type="checkbox" name="consent_accuracy" value="yes" required> ${L(
              "Prohlašuji, že uvedené údaje jsou pravdivé a úplné.",
              "I declare the information is true and complete."
            )}</label>
            <label class="check"><input type="checkbox" name="consent_gdpr" value="yes" required> ${L(
              "Souhlasím se zpracováním osobních údajů za účelem objednání a poskytnutí zdravotní péče dle informací v dokumentaci ordinace.",
              "I agree to personal data processing for appointment booking and healthcare per the practice privacy notice."
            )}</label>
          </div>
        </fieldset>
      `;
    },
  });

  steps.push({
    id: "identity",
    t: () => L("Identifikace pacienta", "Patient identification"),
    d: () =>
      L(
        "Údaje pro zdravotnickou dokumentaci a zpětné spojení.",
        "Details for medical records and contacting you."
      ),
    render() {
      return `
        <div class="grid-2" style="margin-bottom:1rem">
          <div class="field">
            <label for="first_name">${L("Jméno", "First name")}</label>
            <input type="text" id="first_name" name="first_name" required autocomplete="given-name">
          </div>
          <div class="field">
            <label for="last_name">${L("Příjmení", "Last name")}</label>
            <input type="text" id="last_name" name="last_name" required autocomplete="family-name">
          </div>
        </div>
        <div class="field">
          <label for="birthdate">${L("Datum narození", "Date of birth")}</label>
          <input type="date" id="birthdate" name="birthdate" required>
        </div>
        <div class="field">
          <label for="personal_id">${L(
            "Rodné číslo (nepovinné, pokud chcete urychlit párování v systému)",
            "National ID (optional, speeds matching in the system)"
          )}</label>
          <input type="text" id="personal_id" name="personal_id" inputmode="numeric" autocomplete="off" placeholder="XXXXXXXX/XXXX">
          <p class="hint">${L(
            "Uvedení RČ je dobrovolné. Pokud ho nevyplníte, ověříme totožnost při návštěvě.",
            "Providing ID is voluntary. If omitted we verify identity at the visit."
          )}</p>
        </div>
        <div class="field">
          <label for="insurer">${L("Zdravotní pojišťovna", "Health insurer")}</label>
          <select id="insurer" name="insurer" required>
            <option value="">${L("— zvolte —", "— choose —")}</option>
            <option>VZP</option>
            <option>ČPZP</option>
            <option>OZP</option>
            <option>ZPŠ</option>
            <option>VoZP</option>
            <option>RBP</option>
            <option>${L("jiná / cizinec", "other / foreign")}</option>
          </select>
        </div>
        ${
          clinic === "rheum"
            ? `<div class="field">
            <label for="gp_name">${L("Praktický lékař (jméno a město ordinace)", "GP (name and town of practice)")}</label>
            <input type="text" id="gp_name" name="gp_name" required placeholder="${L("MUDr. …, Praha …", "Dr …, Prague …")}">
            <p class="hint">${L(
              "U specialisty uvádíme registrujícího praktického lékaře.",
              "For specialist care we list your registered GP."
            )}</p>
          </div>`
            : `<div class="field">
            <label for="registered_here">${L("Jste u nás registrovaný pacient?", "Are you registered with our practice?")}</label>
            <select id="registered_here" name="registered_here" required>
              <option value="">${L("— zvolte —", "— choose —")}</option>
              <option value="yes">${L("Ano", "Yes")}</option>
              <option value="no">${L("Ne", "No")}</option>
            </select>
          </div>`
        }
        <div class="field">
          <label for="phone">${L("Telefonní číslo", "Phone number")}</label>
          <input type="tel" id="phone" name="phone" required autocomplete="tel" placeholder="+420 …">
        </div>
        <div class="field">
          <label for="email">${L("E-mail", "Email")}</label>
          <input type="email" id="email" name="email" autocomplete="email" placeholder="${L(
            "pro potvrzení objednávky",
            "for appointment confirmation"
          )}">
        </div>
        <div class="field">
          <label for="contact_pref">${L("Preferovaný způsob kontaktu", "Preferred contact method")}</label>
          <select id="contact_pref" name="contact_pref" required>
            <option value="phone">${L("Telefon", "Phone")}</option>
            <option value="sms">SMS</option>
            <option value="email">${L("E-mail", "Email")}</option>
          </select>
        </div>
        <div class="field">
          <label for="address">${L(
            "Trvalá adresa / korespondenční adresa (nepovinné)",
            "Permanent / correspondence address (optional)"
          )}</label>
          <input type="text" id="address" name="address" autocomplete="street-address" placeholder="${L(
            "ulice, PSČ, město",
            "street, postcode, city"
          )}">
        </div>
      `;
    },
  });

  steps.push({
    id: "reason",
    t: () => L("Důvod žádosti o vyšetření", "Reason for the visit"),
    d: () =>
      L(
        "Čím podrobnější popis, tím lépe se na návštěvu připravíme.",
        "The more detail you give, the better we can prepare."
      ),
    render() {
      return `
        <div class="field">
          <label for="chief_complaint">${L("Hlavní obtíže / důvod návštěvy", "Main symptoms / reason for visit")}</label>
          <textarea id="chief_complaint" name="chief_complaint" required placeholder="${L(
            "Popište příznaky, lokalizaci, intenzitu, co zhoršuje/ulevuje…",
            "Describe symptoms, location, severity, what worsens / relieves…"
          )}"></textarea>
        </div>
        <div class="field">
          <label for="symptom_duration">${L("Délka potíží", "Duration of symptoms")}</label>
          <select id="symptom_duration" name="symptom_duration" required>
            <option value="">${L("— zvolte —", "— choose —")}</option>
            <option value="d1">${L("do 24 hodin", "under 24 hours")}</option>
            <option value="w1">${L("2–7 dní", "2–7 days")}</option>
            <option value="m1">${L("1–4 týdny", "1–4 weeks")}</option>
            <option value="m3">${L("1–3 měsíce", "1–3 months")}</option>
            <option value="long">${L("déle než 3 měsíce", "more than 3 months")}</option>
            <option value="na">${L("nelze určit / střídavě", "unclear / intermittent")}</option>
          </select>
        </div>
        <div class="field">
          <label for="previous_care">${L(
            "Dosavadní vyšetření / léčba u jiného lékaře (nepovinné)",
            "Prior tests / treatment elsewhere (optional)"
          )}</label>
          <textarea id="previous_care" name="previous_care" placeholder="${L(
            "specialista, datum, závěr…",
            "specialist, date, conclusion…"
          )}"></textarea>
        </div>
        <div class="field">
          <label for="language">${L("Preferovaný jazyk komunikace", "Preferred language")}</label>
          <select id="language" name="language">
            <option>${L("čeština", "Czech")}</option>
            <option>${L("angličtina", "English")}</option>
            <option>${L("jiný (uveďte do poznámky)", "other (note below)")}</option>
          </select>
        </div>
        <div class="field">
          <label for="barriers">${L(
            "Komunikační nebo pohybové bariéry (nepovinné)",
            "Communication or mobility barriers (optional)"
          )}</label>
          <input type="text" id="barriers" name="barriers" placeholder="${L(
            "např. neslyšící, doprovod nutný…",
            "e.g. hearing impairment, escort needed…"
          )}">
        </div>
      `;
    },
  });

  steps.push({
    id: "meds",
    t: () => L("Léky, alergie, závažná onemocnění", "Medications, allergies, serious conditions"),
    d: () =>
      L(
        "Kritické informace pro bezpečné předepsání a vyšetření.",
        "Critical information for safe prescribing and examination."
      ),
    render() {
      return `
        <div class="field">
          <label for="medications">${L("Pravidelně užívané léky a doplňky", "Regular medications and supplements")}</label>
          <textarea id="medications" name="medications" required placeholder="${L(
            "název, dávkování; pokud nevíte přesně, napište „pravidelně léky na tlak / cholesterol“…",
            "name, dose; if unsure write e.g. “regular BP / cholesterol meds”…"
          )}"></textarea>
        </div>
        <div class="field">
          <label for="drug_allergies">${L("Alergie na léky", "Drug allergies")}</label>
          <textarea id="drug_allergies" name="drug_allergies" placeholder="${L(
            "pokud žádné, napište „žádné známé“",
            "if none, write “none known”"
          )}"></textarea>
        </div>
        <div class="field">
          <label for="other_allergies">${L("Ostatní alergie", "Other allergies")}</label>
          <textarea id="other_allergies" name="other_allergies" placeholder="${L(
            "potraviny, pyl, latex…",
            "foods, pollen, latex…"
          )}"></textarea>
        </div>
        <div class="field">
          <label for="chronic">${L(
            "Chronická onemocnění (diabetes, hypertenze, astma, onkologická…)",
            "Chronic conditions (diabetes, hypertension, asthma, oncology…)"
          )}</label>
          <textarea id="chronic" name="chronic" placeholder="${L("stručný seznam", "brief list")}"></textarea>
        </div>
        <div class="field">
          <label for="surgery">${L(
            "Operace a hospitalizace v posledních 5 letech (nepovinné)",
            "Surgery and hospital admissions in the last 5 years (optional)"
          )}</label>
          <textarea id="surgery" name="surgery"></textarea>
        </div>
        <fieldset>
          <legend>${L("Zvláštní stavy", "Special situations")}</legend>
          <div class="check-list">
            <label class="check"><input type="checkbox" name="state_pregnant" value="yes"> ${L("Těhotenství", "Pregnancy")}</label>
            <label class="check"><input type="checkbox" name="state_breastfeeding" value="yes"> ${L("Kojení", "Breastfeeding")}</label>
            <label class="check"><input type="checkbox" name="state_anticoag" value="yes"> ${L(
              "Antikoagulační léčba (warfarin, NOAC…)",
              "Anticoagulation (warfarin, DOAC…)"
            )}</label>
            <label class="check"><input type="checkbox" name="state_immunosup" value="yes"> ${L(
              "Imunosuprese / biologická léčba",
              "Immunosuppression / biologic therapy"
            )}</label>
          </div>
        </fieldset>
      `;
    },
  });

  steps.push({
    id: "infection",
    t: () => L("Infekční screening", "Infection screening"),
    d: () =>
      clinic === "gp"
        ? L(
            "První polovina ordinačních hodin je vyhrazena pro pacienty bez akutní infekce dýchacích cest. Pomůže nám vědět o příznacích předem.",
            "The first half of office hours is reserved for patients without acute respiratory infection. Knowing symptoms in advance helps us."
          )
        : L(
            "Kvůli ochraně ostatních pacientů a personálu potřebujeme vědět o možné infekci.",
            "To protect other patients and staff we need to know about possible infection."
          ),
    render() {
      return `
        <fieldset>
          <legend>${L("Máte nebo jste měl(a) v posledních 14 dnech:", "In the last 14 days have you had:")}</legend>
          <div class="check-list">
            <label class="check"><input type="checkbox" name="sx_fever" value="yes"> ${L("Teploty nad 38 °C", "Fever over 38 °C")}</label>
            <label class="check"><input type="checkbox" name="sx_cough" value="yes"> ${L("Nový kašel / dušnost", "New cough / shortness of breath")}</label>
            <label class="check"><input type="checkbox" name="sx_throat" value="yes"> ${L("Bolest v krku / rýmu", "Sore throat / runny nose")}</label>
            <label class="check"><input type="checkbox" name="sx_gi" value="yes"> ${L("Průjem / zvracení", "Diarrhoea / vomiting")}</label>
            <label class="check"><input type="checkbox" name="sx_rash" value="yes"> ${L(
              "Nevysvětlitelná kožní vyrážka s horečkou",
              "Unexplained skin rash with fever"
            )}</label>
            <label class="check"><input type="checkbox" name="sx_none" value="yes"> ${L("Žádné z uvedeného", "None of the above")}</label>
          </div>
        </fieldset>
        <div class="field">
          <label for="infection_note">${L(
            "Upřesnění / kontakt s infekčním onemocněním (nepovinné)",
            "Details / contact with infectious illness (optional)"
          )}</label>
          <textarea id="infection_note" name="infection_note"></textarea>
        </div>
        <div class="field">
          <label for="covid_vax">${L("Očkování proti COVID-19 (stav)", "COVID-19 vaccination status")}</label>
          <select id="covid_vax" name="covid_vax">
            <option value="na">${L("raději neuvádím", "prefer not to say")}</option>
            <option value="full">${L("dokončené", "completed")}</option>
            <option value="partial">${L("částečné", "partial")}</option>
            <option value="none">${L("ne", "no")}</option>
          </select>
        </div>
      `;
    },
  });

  steps.push({
    id: "specialty",
    t: () =>
      clinic === "gp"
        ? L("Praktický lékař — doplnění", "GP — additional details")
        : L("Revmatologie — doplnění", "Rheumatology — additional details"),
    d: () =>
      clinic === "gp"
        ? L(
            "Abychom správně naordinovali čas a délku návštěvy.",
            "So we can allocate the right length of appointment."
          )
        : L(
            "Specifické informace pro revmatologické vyšetření.",
            "Specific information for the rheumatology consultation."
          ),
    render() {
      if (clinic === "gp") {
        return `
          <fieldset>
            <legend>${L(
              "Co od návštěvy očekáváte? (můžete zaškrtnout více)",
              "What do you expect from the visit? (multiple)"
            )}</legend>
            <div class="check-list">
              <label class="check"><input type="checkbox" name="gp_need_acute" value="yes"> ${L(
                "Akutní stav (horečka, bolesti, infekce)",
                "Acute issue (fever, pain, infection)"
              )}</label>
              <label class="check"><input type="checkbox" name="gp_need_chronic" value="yes"> ${L(
                "Chronická onemocnění / kontrola",
                "Chronic disease / follow-up"
              )}</label>
              <label class="check"><input type="checkbox" name="gp_need_prev" value="yes"> ${L(
                "Preventivní prohlídka",
                "Preventive check-up"
              )}</label>
              <label class="check"><input type="checkbox" name="gp_need_cert" value="yes"> ${L(
                "Lékařské potvrzení / posudek",
                "Medical certificate / assessment"
              )}</label>
              <label class="check"><input type="checkbox" name="gp_need_vax" value="yes"> ${L(
                "Očkování / konzultace očkování",
                "Vaccination / vaccination advice"
              )}</label>
              <label class="check"><input type="checkbox" name="gp_need_labs" value="yes"> ${L(
                "Žádanka na laboratorní vyšetření",
                "Laboratory test referral"
              )}</label>
            </div>
          </fieldset>
          <div class="field">
            <label for="sick_leave">${L("Potřebujete vyřídit pracovní neschopnost?", "Do you need sick leave?")}</label>
            <select id="sick_leave" name="sick_leave">
              <option value="no">${L("ne", "no")}</option>
              <option value="maybe">${L("možná podle nálezu", "maybe depending on findings")}</option>
              <option value="yes">${L("ano, hlavní důvod návštěvy", "yes, main reason for visit")}</option>
            </select>
          </div>
          <div class="field">
            <label for="gp_notes">${L("Další poznámky pro sestru / lékaře", "Further notes for nurse / doctor")}</label>
            <textarea id="gp_notes" name="gp_notes"></textarea>
          </div>
        `;
      }
      return `
        <div class="field">
          <label for="joints">${L("Postižené oblasti / klouby", "Affected areas / joints")}</label>
          <textarea id="joints" name="joints" placeholder="${L(
            "např. MCP klouby rukou, kolena, páteř…",
            "e.g. MCP joints of hands, knees, spine…"
          )}"></textarea>
        </div>
        <div class="field">
          <label for="stiffness">${L("Ranní ztuhlost kloubů / páteře", "Morning stiffness of joints / spine")}</label>
          <select id="stiffness" name="stiffness">
            <option value="na">${L("nevyplněno", "not stated")}</option>
            <option value="0">${L("žádná", "none")}</option>
            <option value="lt30">${L("do 30 minut", "up to 30 minutes")}</option>
            <option value="30-60">${L("30–60 minut", "30–60 minutes")}</option>
            <option value="gt60">${L("nad 60 minut", "over 60 minutes")}</option>
          </select>
        </div>
        <div class="field">
          <label for="rheum_history">${L(
            "Dříve stanovena revmatologická diagnóza (nepovinné)",
            "Known rheumatology diagnosis (optional)"
          )}</label>
          <input type="text" id="rheum_history" name="rheum_history" placeholder="${L("např. RA, PSA, MCTD…", "e.g. RA, PsA, MCTD…")}">
        </div>
        <div class="field">
          <label for="family_rheum">${L("Revmatologická onemocnění v rodině", "Rheumatic disease in the family")}</label>
          <textarea id="family_rheum" name="family_rheum"></textarea>
        </div>
        <fieldset>
          <legend>${L("Dostupná vyšetření", "Tests you already have")}</legend>
          <div class="check-list">
            <label class="check"><input type="checkbox" name="labs_recent" value="yes"> ${L(
              "Mám nedávné laboratorní výsledky (CRP, FW, krevní obraz…)",
              "I have recent labs (CRP, ESR, blood count…)"
            )}</label>
            <label class="check"><input type="checkbox" name="serology" value="yes"> ${L(
              "Mám sérologii (RF, anti-CCP, HLA-B27…)",
              "I have serology (RF, anti-CCP, HLA-B27…)"
            )}</label>
            <label class="check"><input type="checkbox" name="imaging" value="yes"> ${L(
              "Mám zobrazovací vyšetření (RTG, USG, MR…)",
              "I have imaging (X-ray, ultrasound, MRI…)"
            )}</label>
          </div>
        </fieldset>
        <div class="field">
          <label for="rheum_notes">${L("Další informace pro revmatologa", "Further information for rheumatologist")}</label>
          <textarea id="rheum_notes" name="rheum_notes"></textarea>
        </div>
      `;
    },
  });

  steps.push({
    id: "summary",
    t: () => L("Shrnutí a odeslání", "Summary & submit"),
    d: () =>
      L(
        "Zkontrolujte údaje. Po odeslání vás budeme kontaktovat s návrhem termínu.",
        "Review your details. After submission we will contact you with a proposed slot."
      ),
    render() {
      return `<div id="summary-area" class="booking-summary" aria-live="polite"></div>
      <p class="muted" style="font-size:0.92rem;margin-top:1rem">
        ${L(
          "Tento formulář je ukázková implementace bez napojení na ordinanční systém. V ostrém provozu by se údaje odeslaly zabezpečeně do ordinace. Nyní si můžete zkopírovat souhrn nebo nás kontaktovat prostřednictvím online rezervačního systému či telefonicky.",
          "This form is a demo without connection to a practice system. In production data would be sent securely to the clinic. You can copy the summary or reach us via the online booking system or by phone."
        )}
      </p>`;
    },
    onEnter() {
      const area = document.getElementById("summary-area");
      if (!area) return;
      const data = collectFormData();
      const rows = Object.entries(data)
        .filter(([, v]) => v !== "" && v != null)
        .map(([k, v]) => {
          const label = humanize(k);
          const val = formatSummaryValue(k, v);
          return `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(val)}</dd>`;
        })
        .join("");
      area.innerHTML = `<dl>${rows}</dl>`;
    },
  });

  const fieldState = {};

  function saveCurrentStepFields() {
    if (!stepBody) return;
    stepBody.querySelectorAll("[name]").forEach((el) => {
      if (!el.name) return;
      if (el.type === "checkbox") fieldState[el.name] = el.checked;
      else fieldState[el.name] = el.value;
    });
  }

  function restoreCurrentStepFields() {
    if (!stepBody) return;
    stepBody.querySelectorAll("[name]").forEach((el) => {
      if (!Object.prototype.hasOwnProperty.call(fieldState, el.name)) return;
      const v = fieldState[el.name];
      if (el.type === "checkbox") el.checked = Boolean(v);
      else el.value = v == null ? "" : String(v);
    });
  }

  function formatSummaryValue(key, val) {
    const v = String(val);
    const visit_type = {
      first: () => L("První návštěva", "First visit"),
      follow: () => L("Opakovaná návštěva / kontrola", "Follow-up visit"),
      acute: () => L("Akutní stav", "Acute issue"),
      results: () => L("Konzultace výsledků", "Discussing results"),
    };
    const urgency = {
      standard: () => L("Standardně do několika týdnů", "Standard — within a few weeks"),
      sooner: () => L("Dříve, pokud se uvolní termín", "Sooner if a slot opens"),
      specific: () => L("Konkrétní časové okno", "Specific time window"),
    };
    const symptom_duration = {
      d1: () => L("do 24 hodin", "under 24 hours"),
      w1: () => L("2–7 dní", "2–7 days"),
      m1: () => L("1–4 týdny", "1–4 weeks"),
      m3: () => L("1–3 měsíce", "1–3 months"),
      long: () => L("déle než 3 měsíce", "more than 3 months"),
      na: () => L("nelze určit / střídavě", "unclear / intermittent"),
    };
    const contact_pref = {
      phone: () => L("Telefon", "Phone"),
      sms: () => "SMS",
      email: () => L("E-mail", "Email"),
    };
    const covid_vax = {
      na: () => L("raději neuvádím", "prefer not to say"),
      full: () => L("dokončené očkování", "completed vaccination"),
      partial: () => L("částečné", "partial"),
      none: () => L("neočkován/a", "not vaccinated"),
    };
    const registered_here = {
      yes: () => L("ano", "yes"),
      no: () => L("ne", "no"),
    };
    const stiffness = {
      na: () => L("nevyplněno", "not stated"),
      0: () => L("žádná", "none"),
      lt30: () => L("do 30 minut", "up to 30 minutes"),
      "30-60": () => L("30–60 minut", "30–60 minutes"),
      gt60: () => L("nad 60 minut", "over 60 minutes"),
    };
    const sick_leave = {
      no: () => L("ne", "no"),
      maybe: () => L("možná podle nálezu", "maybe depending on findings"),
      yes: () => L("ano, hlavní důvod návštěvy", "yes, main reason for visit"),
    };

    const tables = {
      visit_type,
      urgency,
      symptom_duration,
      contact_pref,
      covid_vax,
      registered_here,
      stiffness,
      sick_leave,
    };

    const tbl = tables[key];
    if (tbl && tbl[v]) return tbl[v]();
    if (v === "ano" || v === "ne") return L(v, v === "ano" ? "yes" : "no");
    return v;
  }

  function humanize(key) {
    const labels = {
      visit_type: () => L("Typ návštěvy", "Visit type"),
      urgency: () => L("Preference termínu", "Scheduling preference"),
      preferred_slots: () => L("Preferované termíny", "Preferred times"),
      consent_accuracy: () => L("Prohlášení o pravdivosti údajů", "Accuracy declaration"),
      consent_gdpr: () => L("Souhlas se zpracováním údajů", "Consent to data processing"),
      first_name: () => L("Jméno", "First name"),
      last_name: () => L("Příjmení", "Last name"),
      birthdate: () => L("Datum narození", "Date of birth"),
      personal_id: () => L("Rodné číslo", "National ID"),
      insurer: () => L("Pojišťovna", "Insurer"),
      gp_name: () => L("Praktický lékař", "GP"),
      registered_here: () => L("Registrován u nás", "Registered here"),
      phone: () => L("Telefon", "Phone"),
      email: () => L("E-mail", "Email"),
      contact_pref: () => L("Kontakt", "Contact"),
      address: () => L("Adresa", "Address"),
      chief_complaint: () => L("Hlavní obtíže", "Main symptoms"),
      symptom_duration: () => L("Délka potíží", "Symptom duration"),
      previous_care: () => L("Předchozí péče", "Previous care"),
      language: () => L("Jazyk", "Language"),
      barriers: () => L("Bariéry", "Barriers"),
      medications: () => L("Léky", "Medications"),
      drug_allergies: () => L("Alergie na léky", "Drug allergies"),
      other_allergies: () => L("Ostatní alergie", "Other allergies"),
      chronic: () => L("Chronická onemocnění", "Chronic conditions"),
      surgery: () => L("Operace / hospitalizace", "Surgery / admission"),
      infection_note: () => L("Infekce — poznámka", "Infection note"),
      covid_vax: () => L("Očkování COVID-19", "COVID-19 vaccination"),
      gp_notes: () => L("Poznámky PLDD", "GP notes"),
      joints: () => L("Klouby / lokace", "Joints / location"),
      stiffness: () => L("Ranní ztuhlost", "Morning stiffness"),
      rheum_history: () => L("Revmatologická anamnéza", "Rheumatology history"),
      family_rheum: () => L("Rodinná anamnéza", "Family history"),
      rheum_notes: () => L("Poznámky revmatologie", "Rheumatology notes"),
      sick_leave: () => L("Pracovní neschopnost", "Sick leave"),
      clinic: () => L("Ordinace", "Practice"),
      sx_fever: () => L("Infekce — teploty", "Infection — fever"),
      sx_cough: () => L("Infekce — kašel / dušnost", "Infection — cough / SOB"),
      sx_throat: () => L("Infekce — krk / rýma", "Infection — throat / cold"),
      sx_gi: () => L("Infekce — průjem / zvracení", "Infection — GI"),
      sx_rash: () => L("Infekce — vyrážka s horečkou", "Infection — rash with fever"),
      sx_none: () => L("Infekce — bez příznaků", "Infection — none"),
      state_pregnant: () => L("Těhotenství", "Pregnancy"),
      state_breastfeeding: () => L("Kojení", "Breastfeeding"),
      state_anticoag: () => L("Antikoagulace", "Anticoagulation"),
      state_immunosup: () => L("Imunosuprese / biologika", "Immunosuppression / biologics"),
      gp_need_acute: () => L("PLDD — akutní stav", "GP — acute"),
      gp_need_chronic: () => L("PLDD — chronická péče", "GP — chronic"),
      gp_need_prev: () => L("PLDD — preventivní prohlídka", "GP — prevention"),
      gp_need_cert: () => L("PLDD — potvrzení / posudek", "GP — certificate"),
      gp_need_vax: () => L("PLDD — očkování", "GP — vaccination"),
      gp_need_labs: () => L("PLDD — laboratorní žádanka", "GP — lab referral"),
      labs_recent: () => L("Mám nedávné lab. výsledky", "Recent lab results"),
      serology: () => L("Mám sérologii", "Serology available"),
      imaging: () => L("Mám zobrazovací vyšetření", "Imaging available"),
    };
    if (labels[key]) return labels[key]();
    return key;
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function collectFormData() {
    saveCurrentStepFields();
    const out = { clinic: clinicDisplayLabel() };
    Object.entries(fieldState).forEach(([key, val]) => {
      if (val === "" || val == null) return;
      if (typeof val === "boolean") out[key] = val ? "ano" : "ne";
      else out[key] = val;
    });
    return out;
  }

  let stepIndex = 0;
  let progressEl;
  let stepTitle;
  let stepDesc;
  let stepBody;
  let btnBack;
  let btnNext;
  let errorBox;

  function renderProgress() {
    if (!progressEl) return;
    progressEl.innerHTML = steps
      .map((_, i) => {
        let cls = "progress-step";
        if (i < stepIndex) cls += " is-done";
        if (i === stepIndex) cls += " is-active";
        return `<div class="${cls}" role="presentation"></div>`;
      })
      .join("");
  }

  function validateStep() {
    const form = document.getElementById("booking-form");
    if (!form) return true;
    const fields = stepBody.querySelectorAll("[required]");
    for (const f of fields) {
      if (f.type === "checkbox") {
        if (f.required && !f.checked) return false;
      } else if (!f.value.trim()) return false;
    }
    if (steps[stepIndex].id === "infection") {
      const none = form.querySelector('[name="sx_none"]');
      const anyOther = [
        "sx_fever",
        "sx_cough",
        "sx_throat",
        "sx_gi",
        "sx_rash",
      ].some((n) => form.querySelector(`[name="${n}"]`)?.checked);
      if (none && none.checked && anyOther) {
        if (errorBox) {
          errorBox.textContent = L(
            "Zaškrtli jste „žádné příznaky“ i konkrétní příznaky. Upravte prosím infekční screening.",
            "You selected “no symptoms” and specific symptoms. Please fix the infection screening."
          );
          errorBox.hidden = false;
        }
        return false;
      }
      if (none && !none.checked && !anyOther) {
        if (errorBox) {
          errorBox.textContent = L(
            "Vyberte buď konkrétní příznaky, nebo potvrďte, že nemáte žádné z uvedeného.",
            "Either select specific symptoms or confirm none of the listed items."
          );
          errorBox.hidden = false;
        }
        return false;
      }
    }
    if (errorBox) errorBox.hidden = true;
    return true;
  }

  function renderStep() {
    const step = steps[stepIndex];
    if (stepTitle) stepTitle.textContent = step.t ? step.t() : step.title || "";
    if (stepDesc) stepDesc.textContent = step.d ? step.d() : step.description || "";
    if (stepBody) stepBody.innerHTML = step.render();
    restoreCurrentStepFields();
    if (step.onEnter) step.onEnter();
    if (btnBack) {
      btnBack.style.visibility = stepIndex === 0 ? "hidden" : "visible";
      btnBack.textContent = L("Zpět", "Back");
    }
    if (btnNext) {
      btnNext.textContent =
        stepIndex === steps.length - 1
          ? L("Odeslat žádost", "Submit request")
          : L("Pokračovat", "Continue");
    }
    renderProgress();
  }

  function showSuccess() {
    const data = collectFormData();
    try {
      sessionStorage.setItem(
        "last_booking_payload",
        JSON.stringify({ ...data, submittedAt: new Date().toISOString() })
      );
    } catch (_) {}
    document.getElementById("booking-wizard").hidden = true;
    const ok = document.getElementById("booking-success");
    ok.hidden = false;
    const copyBtn = document.getElementById("btn-copy");
    if (copyBtn) {
      copyBtn.textContent = L("Kopírovat souhrn (JSON)", "Copy summary (JSON)");
      copyBtn.onclick = async () => {
        const text = JSON.stringify(data, null, 2);
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.textContent = L("Zkopírováno", "Copied");
          setTimeout(() => {
            copyBtn.textContent = L("Kopírovat souhrn (JSON)", "Copy summary (JSON)");
          }, 2000);
        } catch (_) {
          alert(text);
        }
      };
    }
  }

  const host = document.getElementById("booking-wizard");
  if (host) {
    host.innerHTML = `
    <form id="booking-form" novalidate>
      <div class="progress" id="booking-progress" aria-hidden="true"></div>
      <div class="booking-step">
        <h2 id="step-title"></h2>
        <p class="step-desc" id="step-desc"></p>
        <div id="step-body"></div>
        <p class="error-text" id="booking-error" hidden></p>
        <div class="booking-nav">
          <button type="button" class="btn btn--ghost" id="btn-back">Zpět</button>
          <button type="button" class="btn btn--primary" id="btn-next">Pokračovat</button>
        </div>
      </div>
    </form>
  `;
    progressEl = document.getElementById("booking-progress");
    stepTitle = document.getElementById("step-title");
    stepDesc = document.getElementById("step-desc");
    stepBody = document.getElementById("step-body");
    btnBack = document.getElementById("btn-back");
    btnNext = document.getElementById("btn-next");
    errorBox = document.getElementById("booking-error");

    btnBack.addEventListener("click", () => {
      if (stepIndex > 0) {
        saveCurrentStepFields();
        stepIndex -= 1;
        renderStep();
      }
    });

    btnNext.addEventListener("click", () => {
      if (!validateStep()) return;
      saveCurrentStepFields();
      if (stepIndex < steps.length - 1) {
        stepIndex += 1;
        renderStep();
      } else {
        showSuccess();
      }
    });

    renderStep();

    window.addEventListener("oj-lang-change", () => {
      const wiz = document.getElementById("booking-wizard");
      const okPanel = document.getElementById("booking-success");
      if (wiz && !wiz.hidden) renderStep();
      else if (okPanel && !okPanel.hidden) {
        const cb = document.getElementById("btn-copy");
        if (cb) cb.textContent = L("Kopírovat souhrn (JSON)", "Copy summary (JSON)");
      }
    });
  }
})();
