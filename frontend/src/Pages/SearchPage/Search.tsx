import { useQuery } from "react-query";
import { useSearchContext } from "../../contexts/SearchContext";
import * as apiClient from "../../Api/SearchApi";
import React, { useState, useEffect } from "react";
import SearchResultCard from "../../components/SearchResultCard/SearchResultCard";
import Pagination from "../../components/Pagination/Pagination";
import StarRatingFilter from "../../components/Filters/StarRatingFilter/StarRatingFilter";
import FacilitiesFilter from "../../components/Filters/FacilityFilter/FacilityFilter";
import PriceFilter from "../../components/Filters/PriceFilter/PriceFilter";
import SearchBar from "../../components/VenderCard/SearchBar/SearchBar";

const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOption, setSortOption] = useState<string>("");

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        page: page.toString(),
        stars: selectedStars,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption,
    };

    const { data: banquetData } = useQuery(["searchBanquets", searchParams], () =>
        apiClient.searchBanquet(searchParams)
    );

    // Use effect to scroll to top when banquetData changes
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top
    }, [banquetData]); // Dependency on banquetData

    const handleStarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value;

        setSelectedStars((prevStars) =>
            event.target.checked
                ? [...prevStars, starRating]
                : prevStars.filter((star) => star !== starRating)
        );
    };

    const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const facility = event.target.value;

        setSelectedFacilities((prevFacilities) =>
            event.target.checked
                ? [...prevFacilities, facility]
                : prevFacilities.filter((prevFacility) => prevFacility !== facility)
        );
    };

    return (
        <div>
            <SearchBar />
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
                <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10 ">
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">Filter by:</h3>
                        <StarRatingFilter
                            selectedStars={selectedStars}
                            onChange={handleStarChange}
                        />
                        <FacilitiesFilter
                            selectedFacilities={selectedFacilities}
                            onChange={handleFacilityChange}
                        />
                        <PriceFilter
                            selectedPrice={selectedPrice}
                            onChange={(value?: number) => setSelectedPrice(value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">
                            {banquetData?.pagination.total} Banquets Found
                            {search.destination ? ` in ${search.destination}` : ""}
                        </span>

                        <select
                            value={sortOption}
                            onChange={(event) => setSortOption(event.target.value)}
                            className="p-2 border rounded-md"
                        >
                            <option value="">Sort By</option>
                            <option value="starRating">Star Rating</option>
                            <option value="pricesAsc">Price (low to high)</option>
                            <option value="pricesDesc">Price (high to low)</option>
                        </select>
                    </div>
                    {banquetData?.data.map((banquet) => (
                        <SearchResultCard key={banquet._id} banquet={banquet} />
                    ))}
                    <div>
                        <Pagination
                            page={banquetData?.pagination.page || 1}
                            pages={banquetData?.pagination.pages || 1}
                            onPageChange={(page) => setPage(page)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
