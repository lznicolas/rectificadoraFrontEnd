import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar=({onSearch})=>{
    const [searchText, setSearchText] = useState("");
    
    const handleSearchTextChange = (event) =>{
        setSearchText(event.target.value);
    };

    const handleSearch=() =>{
        onSearch(searchText);
    };
    return (
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleSearchTextChange}
          sx={{ backgroundColor: "white", minWidth: 220 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      );
};

export default SearchBar;
