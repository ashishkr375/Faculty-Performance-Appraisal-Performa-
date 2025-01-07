import { SponsoredRD } from '@/types/form';

interface Props {
    formData: SponsoredRD;
    setFormData: (data: SponsoredRD) => void;
}

const DESCRIPTION = {
    title: "IPR and Technology Transfer",
    description: "04 marks for Technology transfer, 03 marks for the grant of patent, 02 marks for publication of each patent.\n" +
        "01 marks for grant of each Design/copyright and maximum up to 3 marks, no mark for filing of Design/copyright",
    note: "IPR containing 'Institute name as Applicant or one of the Applicants' will only be considered.",
    fields: {
        title: "Title of IPR",
        registrationDate: "Date of registration/filing",
        publicationDate: "Date of publication",
        grantDate: "Date of grant",
        grantNumber: "Grant No.",
        applicant: "Name of Applicant",
        inventors: "Name of Inventor(s)"
    }
};

export const IPR = ({ formData, setFormData }: Props) => {
    const handleAddIPR = () => {
        setFormData({
            ...formData,
            ipr: [...formData.ipr, {
                title: '',
                registrationDate: '',
                publicationDate: '',
                grantDate: '',
                grantNumber: '',
                applicant: '',
                inventors: ''
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-2">{DESCRIPTION.title}</h2>
            <p className="text-gray-600 mb-2">{DESCRIPTION.description}</p>
            <p className="text-gray-600 mb-4 italic">{DESCRIPTION.note}</p>

            {formData.ipr.map((item, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.title}</label>
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                    const updated = [...formData.ipr];
                                    updated[index] = { ...item, title: e.target.value };
                                    setFormData({ ...formData, ipr: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Type</label>
                            <select
                                value={item.type}
                                onChange={(e) => {
                                    const updated = [...formData.ipr];
                                    updated[index] = { ...item, type: e.target.value as 'Patent' | 'Design' | 'Copyright' };
                                    setFormData({ ...formData, ipr: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="Patent">Patent</option>
                                <option value="Design">Design</option>
                                <option value="Copyright">Copyright</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.registrationDate}</label>
                            <input
                                type="date"
                                value={item.registrationDate}
                                onChange={(e) => {
                                    const updated = [...formData.ipr];
                                    updated[index] = { ...item, registrationDate: e.target.value };
                                    setFormData({ ...formData, ipr: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.publicationDate}</label>
                            <input
                                type="date"
                                value={item.publicationDate}
                                onChange={(e) => {
                                    const updated = [...formData.ipr];
                                    updated[index] = { ...item, publicationDate: e.target.value };
                                    setFormData({ ...formData, ipr: updated });
                                }}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.grantDate}</label>
                            <input
                                type="date"
                                value={item.grantDate}
                                onChange={(e) => {
                                    const updated = [...formData.ipr];
                                    updated[index] = { ...item, grantDate: e.target.value };
                                    setFormData({ ...formData, ipr: updated });
                                }}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.grantNumber}</label>
                            <input
                                type="text"
                                value={item.grantNumber}
                                onChange={(e) => {
                                    const updated = [...formData.ipr];
                                    updated[index] = { ...item, grantNumber: e.target.value };
                                    setFormData({ ...formData, ipr: updated });
                                }}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.applicant}</label>
                            <input
                                type="text"
                                value={item.applicant}
                                onChange={(e) => {
                                    const updated = [...formData.ipr];
                                    updated[index] = { ...item, applicant: e.target.value };
                                    setFormData({ ...formData, ipr: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.inventors}</label>
                            <input
                                type="text"
                                value={item.inventors}
                                onChange={(e) => {
                                    const updated = [...formData.ipr];
                                    updated[index] = { ...item, inventors: e.target.value };
                                    setFormData({ ...formData, ipr: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.ipr.filter((_, i) => i !== index);
                            setFormData({ ...formData, ipr: updated });
                        }}
                        className="mt-2 text-red-500"
                    >
                        Remove IPR
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddIPR}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
                + Add IPR
            </button>
        </section>
    );
}; 