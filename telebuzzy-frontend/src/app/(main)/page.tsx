import { absoluteUrl, SITE } from "@/config/site";

// schema.org description of the product for search engines. Only facts the
// page itself states: the free LITE plan; PRO prices are read from the
// contract at checkout, so they are not listed here
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: SITE.name,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/icon.png"),
      email: SITE.supportEmail,
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: SITE.name,
      url: absoluteUrl("/"),
      description: SITE.description,
      publisher: { "@id": absoluteUrl("/#organization") },
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id": absoluteUrl("/#app"),
      name: SITE.name,
      url: absoluteUrl("/"),
      description: SITE.description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      image: absoluteUrl(SITE.ogImage.url),
      publisher: { "@id": absoluteUrl("/#organization") },
      offers: {
        "@type": "Offer",
        name: "LITE",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <script
      type="application/ld+json"
      // "<" is escaped so the JSON can never close the script tag early
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
      }}
    />
  );
}
