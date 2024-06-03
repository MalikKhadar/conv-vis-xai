import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ComparisonTable = ({ tableData }) => {
  let headers = Object.keys(tableData);
  // Locate the "reference" id, remove ref header
  let ref = tableData["ref"];
  let ids = headers.filter(function (item) {
    return item !== "ref";
  })

  // Swap reference id and first element of array
  var refIdx = ids.indexOf(ref);
  var refId = ids[refIdx];
  ids[refIdx] = ids[0];
  ids[0] = refId;

  const fields = Object.keys(tableData[ids[0]]);

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
          {ids.map((id) => (
            <TableRow
              key={id}
            >
              {
                fields.map((field) => (
                  <TableCell style={{
                    backgroundColor: tableData[id][field] === tableData[ids[0]][field] ? '#FFFF7C' : 'white',
                    borderWidth: 1,
                    borderColor: "lightgrey",
                    borderStyle: "solid"
                  }} align="right" key={field}>{tableData[id][field]}</TableCell>
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
