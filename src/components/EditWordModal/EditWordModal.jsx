// import { useState } from 'react';
// import css from './EditWordModal.module.css';

// const EditWordModal = ({ word, onClose, onSave }) => {
//     const [formData, setFormData] = useState({
//         en: word.en || '',
//         ua: word.ua || '',
//         category: word.category || '',
//         progress: word.progress || 0,
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSave({ ...formData, _id: word._id });
//         onClose();
//     };

//     return (
//         <div className={css.modalOverlay}>
//             <div className={css.modal}>
//                 <h2>Edit Word</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className={css.formGroup}>
//                         <label>English</label>
//                         <input
//                             type="text"
//                             name="en"
//                             value={formData.en}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className={css.formGroup}>
//                         <label>Ukrainian</label>
//                         <input
//                             type="text"
//                             name="ua"
//                             value={formData.ua}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className={css.formGroup}>
//                         <label>Category</label>
//                         <input
//                             type="text"
//                             name="category"
//                             value={formData.category}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div className={css.formGroup}>
//                         <label>Progress (%)</label>
//                         <input
//                             type="number"
//                             name="progress"
//                             value={formData.progress}
//                             onChange={handleChange}
//                             min="0"
//                             max="100"
//                         />
//                     </div>
//                     <div className={css.buttonGroup}>
//                         <button type="submit">Save</button>
//                         <button type="button" onClick={onClose}>
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditWordModal;