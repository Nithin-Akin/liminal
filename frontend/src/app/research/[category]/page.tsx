"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppChrome } from "@/components/AppChrome";
import { AuthGate } from "@/components/AuthGate";
import { confirmSource, researchCategory, verifySource, type ResearchResult } from "@/lib/api";

export default function ResearchPage() {
  const params = useParams<{ category: string }>();
  const category = params.category;
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [warning, setWarning] = useState("");
  const [budgetWarning, setBudgetWarning] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [status, setStatus] = useState("Querying open data...");
  const [verified, setVerified] = useState<Record<string, Record<string, string>>>({});
  const [pending, setPending] = useState<Record<string, { url: string; facts: Record<string, string>; confidence: string }>>({});
  const [need, setNeed] = useState(""); const [cuisine, setCuisine] = useState(""); const [maxPrice, setMaxPrice] = useState(""); const [cardPurpose, setCardPurpose] = useState(""); const [housingType, setHousingType] = useState(""); const [maxRent, setMaxRent] = useState("");
  async function search() { setStatus("Querying live place data..."); try { const data = await researchCategory(category, { need, cuisine, ...(maxPrice ? { max_price: maxPrice } : {}), card_purpose: cardPurpose, housing_type: housingType, ...(maxRent ? { max_rent: maxRent } : {}) }); setResults(data.results); setWarning(data.warning ?? ""); setBudgetWarning(data.budget_warning ?? ""); setLocationLabel(data.location_label ?? ""); setStatus(`${data.results.length} mapped results from ${data.source}`); } catch (error) { setStatus(error instanceof Error ? error.message : "Research failed"); } }
  useEffect(() => { search(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);
  return <AuthGate><AppChrome app><section className="section template-shell">
    <div className="kicker">Open-data research · {category}</div>
    <h1 className="serif section-title">Real places around your move.</h1>
    <p className="hero-copy compact-copy">Mapped results are retrieved for your saved city, locality, and destination. Liiminal does not invent rent, availability, reviews, or branch services.</p>
    {category === "housing" || category === "healthcare" || category === "food" ? <section className="research-filters panel-pad"><div className="kicker">Personalize this search</div>{category === "housing" ? <div className="form-grid"><label className="field"><span className="label">Housing type</span><select className="input" value={housingType} onChange={(e) => setHousingType(e.target.value)}><option value="">PG, coliving, or hostel</option><option>PG</option><option>Coliving</option><option>Hostel</option></select></label><label className="field"><span className="label">Maximum monthly rent (INR)</span><input className="input" type="number" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} placeholder="Uses saved budget" /></label></div> : null}{category === "healthcare" ? <label className="field"><span className="label">What are you looking for?</span><select className="input" value={need} onChange={(e) => setNeed(e.target.value)}><option value="">Any healthcare</option><option>General doctor</option><option>Pharmacy</option><option>Mental health</option><option>Dental</option><option>Emergency care</option></select></label> : null}{category === "food" ? <div className="form-grid"><label className="field"><span className="label">Cuisine</span><select className="input" value={cuisine} onChange={(e) => setCuisine(e.target.value)}><option value="">Any cuisine</option><option>North Indian</option><option>South Indian</option><option>Asian</option><option>Continental</option></select></label><label className="field"><span className="label">Max meal price (INR)</span><input className="input" type="number" min="1" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Uses budget context" /></label></div> : null}<button className="btn primary" onClick={search}>Update results</button></section> : null}{locationLabel ? <div className="research-location"><strong>Searching around:</strong> {locationLabel}</div> : null}{budgetWarning ? <div className="budget-alert">{budgetWarning}</div> : null}<p className="source">{status}</p>{warning ? <p className="source">{warning}</p> : null}
    <div className="research-grid">{results.map((item) => <article className="template-card research-card" key={item.id}>
      <div className="kicker">{item.category}</div><h2>{item.name}</h2>
      <p>{item.address || "Address not available in open data."}</p>
      {item.summary ? <p>{item.summary}</p> : null}{item.rating ? <p><strong>Rating:</strong> {item.rating} ({item.review_count ?? 0} reviews) {item.price_level ? `· ${item.price_level}` : ""}</p> : null}
      {item.opening_hours ? <p><strong>Hours:</strong> {item.opening_hours}</p> : null}
      {item.phone ? <p><strong>Phone:</strong> {item.phone}</p> : null}
      <p className="source">Retrieved {item.retrieved_at}. Missing fields are not guessed.</p>
      <div className="actions"><a className="btn" href={item.directions_url} target="_blank" rel="noreferrer">Directions</a>{item.website ? <a className="btn" href={item.website} target="_blank" rel="noreferrer">Official site</a> : null}<a className="btn" href={item.source_url || item.map_url} target="_blank" rel="noreferrer">Source</a>{item.website ? <button className="btn" onClick={async () => { const result = await verifySource(item.website!); setPending((current) => ({ ...current, [item.id]: { url: result.url, facts: result.extraction.facts, confidence: result.extraction.confidence } })); }}>Review source</button> : null}</div>
      {pending[item.id] ? <div className="source verified-facts"><strong>Review extracted values</strong>{Object.entries(pending[item.id].facts).map(([key, value]) => <div key={key}><label><input type="checkbox" defaultChecked /> <strong>{key}:</strong> {value}</label></div>)}{Object.keys(pending[item.id].facts).length === 0 ? <div>No supported fields were found. Nothing will be saved.</div> : <button className="btn primary" onClick={async () => { const source = pending[item.id]; await confirmSource(source.url, category, source.facts, source.confidence); setVerified((current) => ({ ...current, [item.id]: source.facts })); setPending((current) => { const next = { ...current }; delete next[item.id]; return next; }); }}>Confirm and save</button>}</div> : null}
      {verified[item.id] ? <div className="source verified-facts">{Object.entries(verified[item.id]).map(([key, value]) => <div key={key}><strong>{key}:</strong> {value}</div>)}<div>Saved as user-verified.</div></div> : null}
    </article>)}</div>
  </section></AppChrome></AuthGate>;
}
