import { Leaf } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-2 text-brand-700">
        <Leaf className="w-5 h-5" />
        <span className="text-sm font-medium uppercase tracking-wide">About the project</span>
      </div>
      <h1 className="text-3xl font-bold mt-2">AgriConnect</h1>

      <div className="prose prose-sm max-w-none mt-6 text-gray-700">
        <h3>Topic</h3>
        <p>Agriculture as Livelihood.</p>

        <h3>Problem statement</h3>
        <p>
          Small land holdings and the challenges in increasing productivity. The vast
          majority of Indian farmers operate on less than 2 hectares of land. Their
          income is squeezed by middlemen, lack of mechanisation, limited market
          information, and low awareness of government support.
        </p>

        <h3>What AgriConnect does</h3>
        <ul>
          <li>
            Connects farmers <em>directly</em> with consumers through a transparent
            marketplace.
          </li>
          <li>
            Enables online booking of agricultural equipment so small farmers can rent
            instead of buying.
          </li>
          <li>Provides crop-wise market prices and best practices.</li>
          <li>
            Lists key government schemes (PM-KISAN, PMFBY, KCC, PMKSY, e-NAM and
            others) with eligibility and links.
          </li>
          <li>
            Offers role-based dashboards, secure payments, ratings &amp; reviews,
            in-app messaging and an onboarding tour for first-time users.
          </li>
        </ul>

        <h3>Tech stack</h3>
        <ul>
          <li>React 18 + TypeScript + Vite</li>
          <li>Tailwind CSS</li>
          <li>React Router</li>
          <li>localStorage as a prototype data layer</li>
        </ul>

        <p className="text-xs text-gray-500 mt-6">
          This is a student-built prototype. Payments are simulated; no real money
          changes hands. Government scheme links point to the official portals.
        </p>
      </div>
    </div>
  );
}
