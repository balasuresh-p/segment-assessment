import RemoveIcon from '@mui/icons-material/Remove';
import {
    Autocomplete,
    Box,
    Button,
    Drawer,
    FormHelperText,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as yup from 'yup';

const schemaOptions = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
];

const validationSchema = yup.object().shape({
    segmentName: yup.string().required('Segment name is required'),
    segment: yup.array().of(yup.object().shape({
        schema: yup.object().nullable().required('Schema is required')
    })).min(1, 'At least one schema is required'),
});

const Segment = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)

    const formik = useFormik({
        initialValues: {
            segmentName: '',
            segment: [],
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            const data = {
                segment_name: values.segmentName,
                schema: values.segment.map((el) => ({ [el.schema.value]: el.schema.label })),
            };
            try {
                const response = await axios.post('https://webhook.site/bbc19ef8-be2a-494a-b323-dd3a98d0bdd8', data);
                console.log(response.data)
            } catch (error) {
                console.error('Error sending data:', error);
            } finally {
                resetForm();
                setDrawerOpen(false)
                alert("Segment Saved Successully");
            }
        },
    })

    const { values, setFieldValue, handleChange, handleSubmit, touched, errors, resetForm } = formik;
    const handleAddSchema = () => {
        let arr = [...values.segment];
        arr.push({
            schema: null,
        })
        setFieldValue('segment', arr)
    };

    const handleRemoveSchema = (index) => {
        let arr = [...values.segment];
        arr.splice(index, 1)
        setFieldValue('segment', arr)
    }

    const handleDraweOpen = () => {
        setDrawerOpen(true)
    }

    const handleDraweClose = () => {
        resetForm()
        setDrawerOpen(false)
    }

    const handleDropdownChange = (name, value) => {
        setFieldValue(name, value)
    }

    return (
        <Box p={6}>
            <Button variant={'outlined'} size={'small'} onClick={handleDraweOpen}>{'Save segment'}</Button>
            <Drawer
                anchor={'right'}
                open={drawerOpen}
            >
                <form onSubmit={handleSubmit} noValidate>
                    <Typography sx={{ background: 'blue', pl: 3, lineHeight: '60px', color: '#fff', fontWeight: 'bold' }}>{'Saving Segment'}</Typography>
                    <Box width={'400px'} p={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography sx={{}}>{'Enter the Name of the Segment'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name={'segmentName'}
                                    value={values.segmentName}
                                    onChange={handleChange}
                                    placeholder="Name of the segment"
                                    error={touched.segmentName && !!errors.segmentName}
                                    helperText={touched.segmentName && errors.segmentName}
                                    size={'small'}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>{'To save your segment, you need to add the schemas to build the query'}</Typography>
                            </Grid>
                            {values.segment.map((el, index) => {
                                let existSchema = values.segment.map((item, i) => index !== i && item.schema?.value).filter(Boolean);
                                return <Grid key={index} item xs={12}>
                                    <Box display="flex" gap="10px">
                                        <Box flex={1}>
                                            <Autocomplete
                                                disablePortal
                                                id={`segment[${index}].schema`}
                                                value={el.schema}
                                                onChange={(_, val) => handleDropdownChange(`segment[${index}].schema`, val)}
                                                options={schemaOptions}
                                                getOptionDisabled={(option) => existSchema.includes(option.value)}
                                                renderInput={(params) => <TextField
                                                    {...params}
                                                    placeholder="Add schema to segment"
                                                    error={touched.segment?.[index]?.schema && !!errors.segment?.[index]?.schema}
                                                    helperText={touched.segment?.[index]?.schema && errors.segment?.[index]?.schema}
                                                    size={'small'}
                                                    required
                                                />}
                                            />
                                        </Box>
                                        <Button color="secondary" sx={{ minWidth: 'auto' }} onClick={() => handleRemoveSchema(index)}>
                                            <RemoveIcon />
                                        </Button>
                                    </Box>
                                </Grid>
                            })}


                            {values.segment.length > 6 ? null : <Grid item xs={12}>
                                <Button onClick={handleAddSchema} sx={{ textDecoration: 'underline' }} size="small">{'+ Add new schema'}</Button>
                                <FormHelperText error={touched.segment && !!errors.segment}>
                                    {touched.segment && typeof errors.segment === 'string' ? errors.segment : null}
                                </FormHelperText>
                            </Grid>}
                            <Grid item xs={12} pt={4}>
                                <Box display={'flex'} gap={'10px'}>
                                    <Button type="submit" variant="contained" size={'small'}>{'Save the segment'}</Button>
                                    <Button onClick={handleDraweClose} color="secondary" size={'small'}>{'Close'}</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Drawer>
        </Box>

    );
};

export default Segment;
