import React, {
  useEffect,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";

interface CityAutoCompleteProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: SyntheticEvent) => void;
  inputStyle: string;
  labelStyle: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface SyntheticEvent {
  target: {
    name: string;
    value:
      | string
      | {
          city: string;
          iata: string;
          displayText: string;
        };
  };
}

interface Airport {
  city: string;
  iata: string;
  airport: string;
  country?: string;
}

const CityAutoComplete: React.FC<CityAutoCompleteProps> = ({
  name,
  label,
  value,
  onChange,
  inputStyle,
  labelStyle,
  icon: Icon,
}) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState<Airport[]>([]);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const getflight = async () => {
    try {
      const response = await fetch("/airports-min.json");
      const result = await response.json();
      if (Array.isArray(result)) {
        setAirports(result);
      } else {
        throw new Error("No Flight Found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getflight();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    console.log(input, "from on change");
    setQuery(input);

    console.log(name, input, "hello");
    const syntheticEvent: SyntheticEvent = {
      target: {
        name: name,
        value: input,
      },
    };
    onChange(syntheticEvent);

    if (input.length > 0) {
      console.log(input, "from filter");
      const filtered = airports.filter((a) =>
        a.city.toLowerCase().includes(input.toLowerCase())
      );
      console.log(filtered);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (airport: Airport) => {
    const fullText = `${airport.city} (${airport.iata})`;
    setQuery(fullText);
    setSuggestions([]);

    const syntheticEvent: SyntheticEvent = {
      target: {
        name: name,
        value: {
          city: airport.city,
          iata: airport.iata,
          displayText: fullText,
        },
      },
    };
    onChange(syntheticEvent);
  };

  return (
    <div className="relative">
      <label className={labelStyle}>
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>

      <input
        name={name}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={`Enter ${label}`}
        className={inputStyle}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white z-10 shadow rounded w-full max-h-60 overflow-auto border mt-1">
          {suggestions.map((s) => (
            <li
              key={s.iata}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(s)}
            >
              {s.city} ({s.iata}) – {s.airport}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutoComplete;
