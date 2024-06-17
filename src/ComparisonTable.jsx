import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const ComparisonTable = ({ tableData }) => {
  const fields = Object.keys(tableData[0]);

  return (
    <TableContainer style={{ overflow: "auto" }}
      sx={{
        '& .MuiTableCell-sizeMedium': {
          padding: '0px 5px',
        },
      }}>
      <Table>
        <TableHead>
          <TableRow>
            {fields.map((field) => (
              <TableCell key={field} style={{
                borderWidth: 1,
                borderColor: "lightgrey",
                borderStyle: "solid"
              }}>
                <b>{field}</b>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow
              key={index}
            >
              {
                fields.map((field) => (
                  <TableCell style={{
                    borderWidth: 1,
                    borderColor: "lightgrey",
                    // borderBottom: index == 0 ? 2 : 1,
                    // borderBottomColor: index == 0 ? "black" : "lightgrey",
                    borderStyle: "solid"
                  }} align="right" key={field}>{item[field]}</TableCell>
                ))
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ComparisonTable;
