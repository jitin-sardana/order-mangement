import { TextField, Grid } from '@material-ui/core';
const Search = ({ updateData, cityName }) => {    
    return (<>
    <Grid item xs={12}>
        <TextField
            label="Search Client"
            fullWidth={true}
            variant="outlined"
            autoComplete="off"
            placeholder={`Search Client in ${cityName}`}
            margin="normal"
            onChange={(event)=>updateData(event)}
        />
    </Grid>
    </>)
}
export default Search;