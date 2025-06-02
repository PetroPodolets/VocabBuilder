import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { deleteWord, editWord } from '../../redux/word/operation';
import { openEditWordModal } from '../../redux/word/slise';
import EditWordModal from '../EditWordModal/EditWordModal';
import css from "./ActionsButton.module.css"

export default function ActionsMenu({ row }) {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const wordId = useSelector((state) => state.words.editModal.wordId);

    const handleDelete = async () => {
        try {
            if (row.originalWord?._id && token) {
                await dispatch(deleteWord({ wordId: row.originalWord._id, token })).unwrap();
                toast.success(`The word "${row.originalWord?.en || row.word}" was successfully deleted`);
            } else {
                throw new Error('Word ID or token is missing');
            }
        } catch (err) {
            toast.error(`Error deleting the word: ${err.message}`);
            console.error(err);
        }
    };

    const handleSave = async (updatedWord) => {
        try {
            if (updatedWord._id && token) {
                console.log('Calling editWord with:', { wordId: updatedWord._id, wordData: updatedWord, token });
                await dispatch(editWord({ wordId: updatedWord._id, wordData: updatedWord, token })).unwrap();
                toast.success(`The word "${updatedWord.en}" was successfully updated`);
            } else {
                throw new Error('Word ID or token is missing');
            }
        } catch (err) {
            toast.error(`Error updating the word: ${err.message}`);
            console.error('Update error:', err);
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
                            <div className={css.ActionsMenuContainer}>
                                <button
                                    className={css.editButton}
                                    onClick={() => {
                                        dispatch(openEditWordModal(row.originalWord._id));
                                        popupState.close();
                                    }}

                                >
                                    <div className={css.svgContainer}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_126_2600)">
                                                <path d="M11.3334 1.99998C11.5085 1.82488 11.7163 1.68599 11.9451 1.59123C12.1739 1.49647 12.4191 1.44769 12.6667 1.44769C12.9143 1.44769 13.1595 1.49647 13.3883 1.59123C13.6171 1.68599 13.8249 1.82488 14 1.99998C14.1751 2.17507 14.314 2.38294 14.4088 2.61172C14.5036 2.84049 14.5523 3.08569 14.5523 3.33331C14.5523 3.58093 14.5036 3.82613 14.4088 4.05491C14.314 4.28368 14.1751 4.49155 14 4.66664L5.00004 13.6666L1.33337 14.6666L2.33337 11L11.3334 1.99998Z" stroke="#85AA9F" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_126_2600">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    Edit
                                </button>
                                
                                    <button
                                        className={css.deleteButton}
                                        onClick={() => {
                                            handleDelete();
                                            popupState.close();
                                        }}
                                ><div className={css.svgContainer}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 4H3.33333H14" stroke="#85AA9F" stroke-opacity="0.94" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12.6667 3.99998V13.3333C12.6667 13.6869 12.5262 14.0261 12.2762 14.2761C12.0261 14.5262 11.687 14.6666 11.3334 14.6666H4.66671C4.31309 14.6666 3.97395 14.5262 3.7239 14.2761C3.47385 14.0261 3.33337 13.6869 3.33337 13.3333V3.99998M5.33337 3.99998V2.66665C5.33337 2.31302 5.47385 1.97389 5.7239 1.72384C5.97395 1.47379 6.31309 1.33331 6.66671 1.33331H9.33337C9.687 1.33331 10.0261 1.47379 10.2762 1.72384C10.5262 1.97389 10.6667 2.31302 10.6667 2.66665V3.99998" stroke="#85AA9F" stroke-opacity="0.94" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M6.66663 7.33331V11.3333" stroke="#85AA9F" stroke-opacity="0.94" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M9.33337 7.33331V11.3333" stroke="#85AA9F" stroke-opacity="0.94" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                </div>
                                Delete
                            </button>
                        </div>
                    </Typography>
                </Popover>

                    {wordId === row.originalWord._id && (
                <EditWordModal
                    word={row.originalWord}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}
        </PopupState >
    );
}