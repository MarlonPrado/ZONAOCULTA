import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Input, Label, ModalBody, ModalFooter } from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';
import * as AcademicDayActions from '../../../stores/actions/AcademicDayActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const AcademicDayCreateEdit = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [schoolList, setSchoolList] = useState(null);
  const [school, setSchool] = useState(null);
  const [campusList, setCampusList] = useState(null);
  const [campus, setCampus] = useState(null);
  const [schoolYearList, setSchoolYearList] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [day, setDay] = useState(null);
  const [days, setDays] = useState([]);
  const intl = useIntl();

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    if (props?.data?.id) {
      if (props?.data?.school !== undefined && props?.data?.school != null) {
        setSchool({
          key: props?.data?.school?.id,
          label: props?.data?.school?.name,
          value: props?.data?.school?.id,
        });
      }
      if (props?.data?.schoolYear !== undefined && props?.data?.schoolYear != null) {
        setSchoolYear({
          key: props?.data?.schoolYear?.id,
          label: props?.data?.schoolYear?.schoolYear,
          value: props?.data?.schoolYear?.id,
        });
      }
      if (props?.data?.campus !== undefined && props?.data?.campus != null) {
        setCampus({
          key: props?.data?.campus?.id,
          label: props?.data?.campus?.name,
          value: props?.data?.campus?.id,
        });
      }
      if (props?.data?.day !== undefined && props?.data?.day != null) {
        setDay(props?.data?.day.map((c: any) => {
          return { label: intl.messages["display." + c], value: c, key: c };
        }));
      }
      register('campusId', {
        required: true,
        value: props?.data?.id ? props?.data?.campusId : '',
      });
      register('day', {
        required: true,
        value: props?.data?.id ? props?.data?.day : '',
      });
      register('schoolId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolId ? props?.data?.schoolId : props?.loginReducer?.schoolId,
      });
      register('schoolYearId', {
        required: true,
        value: props?.data?.id && props?.data?.schoolYearId ? props?.data?.schoolYearId : props?.loginReducer?.schoolYear,
      });
    } else {
      setSchool({
        key: props?.loginReducer?.schoolData?.id,
        label: props?.loginReducer?.schoolData?.name,
        value: props?.loginReducer?.schoolData?.id,
      });
      setSchoolYear({ label: props?.loginReducer?.schoolYearName, value: props?.loginReducer?.schoolYear, key: props?.loginReducer?.schoolYear });
    }
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
    setDay(null);
    setCampus(null);
    if (props?.loginReducer?.campusId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('campusId', {
        required: true,
        value: props?.loginReducer?.campusId,
      });
    }
    if (props?.loginReducer?.schoolId && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('schoolId', {
        required: true,
        value: props?.loginReducer?.schoolId,
      });
    }
    if (props?.loginReducer?.schoolYear && !props?.data?.id) {
      // set value when register is new and sesion contains value
      register('schoolYearId', {
        required: true,
        value: props?.loginReducer?.schoolYear,
      });
    }
  };

  const getDropdowns = async () => {
    props.getDays().then((data: any) => {
      setDays(data.map((c: any) => {
        return { label: intl.messages["display." + c.name], value: c.name, key: c.name };
      }))
    });
    props.getDropdownsAcademicDay(props?.loginReducer?.schoolId).then((data: any) => {
      setCampusList(
        data.dataCampus.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
    });
    setSchoolList(
      [{
        key: props?.loginReducer?.schoolData?.id,
        label: props?.loginReducer?.schoolData?.name,
        value: props?.loginReducer?.schoolData?.id,
      }]
    );
    setSchoolYearList(
      [{ label: props?.loginReducer?.schoolYearName, value: props?.loginReducer?.schoolYear, key: props?.loginReducer?.schoolYear }]
    )
  };

  const { ref: nameRef, ...nameRest } = register('name', {
    required: true,
    value: props?.data?.id ? props?.data?.name : '',
  });

  const auditInfo = {
    createdAt: props?.data?.id ? props?.data?.createdAt : null,
    updatedAt: props?.data?.id ? props?.data?.createdAt : null,
    createdByUser: props?.data?.id ? props?.data?.createdByUser : null,
    updatedByUser: props?.data?.id ? props?.data?.updatedByUser : null,
    version: props?.data?.id ? props?.data?.version : null,
  };

  return (
    <>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : (
        <>
          <AddNewModal
            modalOpen={props.modalOpen}
            toggleModal={() => {
              cleanForm();
              props.toggleModal();
            }}
            onSubmit={props.onSubmit}
            data={props.data}
            methods={methods}
            control={control}
            handleSubmit={handleSubmit}
            validateForm={true}
          >
            <ModalBody>
              <FormGroupCustom>
                <LabelCustom id="forms.name" required={true} />
                <Input {...nameRest} innerRef={nameRef} className="form-control" />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="forms.workingDays" required={true} />
                <Select
                  isClearable
                  isMulti
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('day', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={days}
                  value={day}
                  onChange={(selectedOption) => {
                    setValue(
                      "day",
                      selectedOption.map((c: any) => {
                        return c.key;
                      }),
                    );
                    setDay(selectedOption);
                    trigger("day")
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"day"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="menu.campus" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('campusId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={campusList}
                  value={campus}
                  onChange={(selectedOption) => {
                    setValue('campusId', selectedOption?.key);
                    setCampus(selectedOption);
                    trigger("campusId")
                  }}
                />
                <RequiredMessagesCustom formState={formState} register={"campusId"} />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="menu.ie" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('schoolId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={schoolList}
                  value={school}
                  isDisabled={true}
                />
              </FormGroupCustom>
              <FormGroupCustom>
                <LabelCustom id="menu.schoolYear" required={true} />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  {...register('schoolYearId', { required: true })}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={schoolYearList}
                  value={schoolYear}
                  isDisabled={true}
                />
                <RequiredMessagesCustom formState={formState} register={"name"} />
              </FormGroupCustom>
            </ModalBody>
            {props?.data?.id ? (
              <ModalFooter className="p-3">
                <CreateEditAuditInformation loading={loading} auditInfo={auditInfo} />
              </ModalFooter>
            ) : (
              <></>
            )}
          </AddNewModal>
        </>
      )}
    </>
  );
};

const mapDispatchToProps = { ...AcademicDayActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcademicDayCreateEdit);
