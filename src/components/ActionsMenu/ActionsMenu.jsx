import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { deleteWord } from '../../redux/word/operation';

export default function ActionsMenu({ row }) {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    const handleDelete = async () => {
        try {
            if (row.originalWord._id && token) {
                await dispatch(deleteWord({ wordId: row.originalWord._id, token })).unwrap();
                toast.success(`The word "${row.word}" was successfully deleted`);
            } else {
                throw new Error('Word ID or token is missing');
            }
        } catch (err) {
            toast.error(`Error deleting the word: ${err.message}`);
            console.error(err);
        }
    };

    return (
        <PopupState variant="popover" popupId={`popover-${row.id}`}>
            {(popupState) => (
                <div style={{ zIndex: 10 }}>
                    <Button
                        variant=""
                        {...bindTrigger(popupState)}
                        sx={{
                            minWidth: '60px',
                            minHeight: '30px',
                            padding: '3px',
                            fontSize: '1.2rem',
                        }}
                        aria-label="Open actions menu"
                    >
                        ...
                    </Button>

                    <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        onClose={popupState.close}
                    >
                        <Typography sx={{ p: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => {
                                    handleDelete();
                                    popupState.close();
                                }}
                                sx={{ width: '90%' }}
                            >
                                Delete
                            </Button>
                        </Typography>
                    </Popover>
                </div>
            )}
        </PopupState>
    );
}
