import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import ChoicesSearchFormInput from '@/components/formikfield/ChoicesSearchFormInput';
import { useGetAllProjectsQuery } from '@/services/authenticateendpoint/project';
import { useUpdateUserMutation } from '@/services/authenticateendpoint/users';
import { useState, useEffect } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const AssignProjectModal = ({ show, onHide, user, onSuccess }) => {
    const { data: projects, error: projectsError } = useGetAllProjectsQuery();
    const [updateUser, { isLoading, error: updateError }] = useUpdateUserMutation();

    useEffect(() => {
        if (projectsError) toast.error(extractApiErrorMessage(projectsError));
    }, [projectsError]);
    useEffect(() => {
        if (updateError) toast.error(extractApiErrorMessage(updateError));
    }, [updateError]);

    const projectOptions = projects?.map(p => ({
        value: p._id,
        label: p.name
    })) || [];

    const initialValues = {
        projectIds: user?.assignedProjects || []
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updateUser({
                id: user._id,
                data: {
                    projectIds: values.projectIds
                }
            }).unwrap();

            if (onSuccess) {
                onSuccess();
            }
            onHide();
        } catch (err) {
            console.error('Failed to assign projects:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <IconifyIcon icon="solar:folder-bold" className="me-2 text-primary" />
                    Assign Projects to {user?.name}
                </Modal.Title>
            </Modal.Header>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={Yup.object({
                    projectIds: Yup.array().min(1, 'Please select at least one project')
                })}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <Modal.Body>
                            <div className="mb-3">
                                <p className="text-muted mb-3">
                                    <IconifyIcon icon="solar:info-circle-broken" className="me-1" />
                                    Select one or more projects to assign to this user
                                </p>
                                <Field name="projectIds">
                                    {({ field, form }) => (
                                        <ChoicesSearchFormInput
                                            label="Select Projects"
                                            labelClassName="form-label fw-bold"
                                            className="form-control"
                                            id="projectIds"
                                            {...field}
                                            multiple
                                            options={projectOptions}
                                            onChange={(val) => form.setFieldValue('projectIds', val)}
                                            placeholder="Search and select projects..."
                                        />
                                    )}
                                </Field>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Assigning...
                                    </>
                                ) : (
                                    <>
                                        <IconifyIcon icon="solar:check-circle-broken" className="me-1" />
                                        Assign Projects
                                    </>
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default AssignProjectModal;
