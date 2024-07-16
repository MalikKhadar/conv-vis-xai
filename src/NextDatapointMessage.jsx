import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

export default function NextDatapointMessage({openNextDatapointMessage, setOpenNextDatapointMessage}) {
    const handleClose = () => setOpenNextDatapointMessage(false);
    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={openNextDatapointMessage}
            onClose={handleClose}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 500,
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                }}
            >
                <Typography
                    component="h2"
                    id="modal-title"
                    level="h4"
                    textColor="inherit"
                    fontWeight="lg"
                    mb={1}
                >
                    Proceeding to next datapoint
                </Typography>
                <Typography
                    component="p"
                    id="modal-title"
                    level="h4"
                    textColor="inherit"
                    fontWeight="lg"
                    mb={1}
                >
                    Click anywhere outside of this box to continue
                </Typography>
            </Sheet>
        </Modal>
    );
}
