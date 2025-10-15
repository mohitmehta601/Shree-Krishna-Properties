import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchResults } from "./SearchResults";

export function SearchResultsWrapper() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleViewProperty = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  return (
    <SearchResults
      query={query}
      onBack={handleBack}
      onViewProperty={handleViewProperty}
    />
  );
}
