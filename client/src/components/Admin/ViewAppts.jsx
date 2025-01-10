import { useState, useEffect } from "react";
import format from "date-fns/format";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import theme from "../../theme";

function ViewAppts({TableHeader, allAppointments}) {
  const [filteredAppointments, setFilteredAppointments] = useState(allAppointments);

  const handleFilter = (event, filter) => {
    const currentDate = new Date();
    let filteredAppts;
    if (filter === "All") { 
      filteredAppts = [...allAppointments];
    } else if (filter === "Past") { 
      filteredAppts = allAppointments.filter(appt => new Date(appt.date) < currentDate);
      filteredAppts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filter === "Future") {  
      filteredAppts = allAppointments.filter(appt => new Date(appt.date) > currentDate);
      filteredAppts.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    setFilteredAppointments(filteredAppts);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
      const handleResize = () => {
        setDropdownOpen(false);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
  }, []);

  return (
    <Grid container sx={{padding: 3.5}}>
      <Grid item> 
        <Autocomplete
          open={dropdownOpen}
          onOpen={() => setDropdownOpen(true)}
          onClose={() => setDropdownOpen(false)}
          options={["All", "Past", "Future"]}
          defaultValue={"All"}
          style={{width: '200px'}}
          clearIcon={null}
          renderInput={(params) => (
            <TextField 
              {...params} 
              inputProps={{ ...params.inputProps, readOnly: true }} 
              variant="standard" 
              label="Filter" 
              placeholder=""                     
              sx={{
                '.MuiInputLabel-root.Mui-focused': {
                  color: theme.palette.admin 
                },
                '.MuiInput-underline:after': {
                  borderBottomColor: theme.palette.admin
                }
              }}
            />
          )}
          onChange={handleFilter}
        />
      </Grid>
      <Grid item xs={12} sx={{paddingTop: 3.5}}> 
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Phone Number</TableHeader>
                <TableHeader>Service</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Time</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appt) => (
                <TableRow key={appt._id}>
                  <TableCell>{appt.name}</TableCell>
                  <TableCell>{appt.email}</TableCell>
                  <TableCell>{appt.phoneNumber}</TableCell>
                  <TableCell>{appt.service}</TableCell>
                  <TableCell>{appt.location}</TableCell>
                  <TableCell>{format(new Date(appt.date), 'MM-dd-yyyy')}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default ViewAppts;