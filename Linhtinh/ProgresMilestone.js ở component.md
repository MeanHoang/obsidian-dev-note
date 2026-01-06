import React, {useContext, useEffect, useMemo, useState} from 'react';  
import './ProgressMilestone.scss';  
import IconProgressMilestone from '../Icon/IconProgressMilestone';  
import {Typography} from '@material-ui/core';  
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';  
import JoyTooltip from '@avada/assets/src/components/JoyTooltip/JoyTooltip';  
import {  
  MILESTONE_AMOUNT_SPEND,  
  MILESTONE_EARNED_POINT,  
  MILESTONE_ORDER,  
  MILESTONE_REFERRAL,  
  MILESTONE_REVIEWS  
} from '@avada/functions/src/const/programs/milestoneTypes';  
import {FloatButtonContext} from '../../contexts/floatButtonContext';  
import {formatNumber} from '@avada/utils/lib/formatNumber';  
import {sortArrayObject} from '@avada/utils/lib/sortArrayObject';  
import formatCurrencySymbol from '@avada/functions/src/helpers/currency/formatCurrencySymbol';  
import i18n from '@avada/functions/src/helpers/translation/i18n';  
import isSingularValue from '../../helpers/isSingularValue';  
import getContentProgressMilestone from '@avada/functions/src/helpers/milestone/getContentProgressMilestone';  
import {Box} from '@shopify/polaris';  
import getStateMilestone from '@avada/assets/src/helpers/program/getStateMilestone';  
import displayMoneyValue from '@avada/functions/src/helpers/program/displayMoney';  
import {getProgressMilestoneCustomer} from '@avada/assets/src/helpers/customer/getProgressMilestoneCustomer';  
import {BorderLinearProgress} from '@avada/assets/src/components/ProgressMilestone/BorderLinearProgress';  
  
/**  
 * * @param program  
 * @param direction  
 * @param dataCustomerMilestone  
 * @returns {Element}  
 * @constructor  
 */  
function ProgressMilestone({program, direction = 'row', dataCustomerMilestone = {}}) {  
  const {settings, customer, shop, isPreview, isLoggedIn, translation, get} = useContext(  
    FloatButtonContext  
  );  
  
  const {milestones = [], typeMilestone} = program;  
  const listMilestone = milestones.sort(sortArrayObject('value'));  
  const {blockTextColor, blockBgColor} = settings;  
  const showFullContent = direction === 'column';  
  
  const [fetchedDataCustomerMilestone, setFetchedDataCustomerMilestone] = useState({});  
  const hasPropData = Object.keys(dataCustomerMilestone).length > 0;  
  
  useEffect(() => {  
    if (!hasPropData && get && typeMilestone) {  
      const fetchData = async () => {  
        try {  
          const {data} = await get(`/customer-milestone?type=${typeMilestone}`);  
          setFetchedDataCustomerMilestone(data || {});  
        } catch (error) {  
          setFetchedDataCustomerMilestone({});  
        }  
      };  
      fetchData();  
    }  
  }, [get, typeMilestone, hasPropData]);  
  const finalDataCustomerMilestone = hasPropData  
    ? dataCustomerMilestone  
    : fetchedDataCustomerMilestone;  
  
  const {state: currentActive} = getStateMilestone({program, customer, isPreview, isLoggedIn});  
  const usedMilestoneValues = useMemo(() => {  
    if (!customer) return [];  
    const milestoneUsageMap = {  
      [MILESTONE_ORDER]: customer.usedMilestoneOrder ?? [],  
      [MILESTONE_EARNED_POINT]: customer.usedMilestoneEarnPoint ?? [],  
      [MILESTONE_AMOUNT_SPEND]: customer.usedMilestoneSpentAmount ?? [],  
      [MILESTONE_REVIEWS]: customer.usedMilestoneReview ?? [],  
      [MILESTONE_REFERRAL]: customer.usedMilestoneReferral ?? []  
    };  
  
    const values = milestoneUsageMap[program.typeMilestone] ?? [];  
    return Array.isArray(values) ? values : [];  
  }, [customer, program?.typeMilestone]);  
  
  const currentCustomerValue = useMemo(() => {  
    switch (program.typeMilestone) {  
      case MILESTONE_ORDER:  
        return finalDataCustomerMilestone[MILESTONE_ORDER] || 0;  
      case MILESTONE_AMOUNT_SPEND:  
        return finalDataCustomerMilestone[MILESTONE_AMOUNT_SPEND] || 0;  
      case MILESTONE_EARNED_POINT:  
        return finalDataCustomerMilestone[MILESTONE_EARNED_POINT] || 0;  
      case MILESTONE_REVIEWS:  
        return finalDataCustomerMilestone[MILESTONE_REVIEWS] || 0;  
      case MILESTONE_REFERRAL:  
        return finalDataCustomerMilestone[MILESTONE_REFERRAL] || 0;  
      default:  
        return 0;  
    }  
  }, [finalDataCustomerMilestone, program.typeMilestone]);  
  
  const currentMilestoneIndex = useMemo(() => {  
    return listMilestone.findIndex(m => {  
      const milestoneValue = Number(m.value);  
      return Number.isFinite(milestoneValue) && currentCustomerValue < milestoneValue;  
    });  
  }, [listMilestone, currentCustomerValue]);  
  
  const currency = formatCurrencySymbol(  
    window.Shopify?.currency?.active || shop?.currency || 'USD'  
  );  
  
  return (  
    <div  
      className={`Avada-ProgressMilestone ${direction}`}  
      id={`avada-${program.id}`}  
      style={{  
        '--Avada-block-bg-color': blockBgColor,  
        '--Avada-block-text-color': blockTextColor  
      }}  
      key={`avada-${program.id}`}  
    >  
      <div className={'Avada-ProgressMilestone__Container'}>  
        {!showFullContent && (  
          <div className="Avada-ProgressMilestone__Line" id="avada-progress-milestone-line"></div>  
        )}  
        {listMilestone.map((milestone, index) => {  
          const {contents, value} = getContentProgressMilestone({  
            shop,  
            milestone,  
            settings,  
            translation  
          });  
          const subs = (() => {  
            const valueFormat = formatNumber(parseFloat(value), 2);  
            const isSingular = isSingularValue(value);  
  
            switch (program.typeMilestone) {  
              case MILESTONE_ORDER:  
                return isSingular  
                  ? i18n('[[WidgetV2]]After completing {{order_amount}} order', translation, {  
                      order_amount: valueFormat  
                    })  
                  : i18n('[[WidgetV2]]After completing {{order_amount}} orders', translation, {  
                      order_amount: valueFormat  
                    });  
  
              case MILESTONE_AMOUNT_SPEND:  
                return i18n('[[WidgetV2]]After spending {{spent_amount}}', translation, {  
                  spent_amount: displayMoneyValue({money: value, currency, settings})  
                });  
              case MILESTONE_EARNED_POINT:  
                return isSingular  
                  ? i18n(  
                      '[[WidgetV2]]After earning {{earned_points}} {{loyalty_point}}',  
                      translation,  
                      {  
                        earned_points: valueFormat,  
                        loyalty_point: settings.pointSingular  
                      }  
                    )  
                  : i18n(  
                      '[[WidgetV2]]After earning {{earned_points}} {{loyalty_point}}',  
                      translation,  
                      {  
                        earned_points: valueFormat,  
                        loyalty_point: settings.pointPlural  
                      }  
                    );  
  
              case MILESTONE_REVIEWS:  
                return isSingular  
                  ? i18n('[[WidgetV2]]After reviewing {{review_times}} time', translation, {  
                      review_times: valueFormat  
                    })  
                  : i18n('[[WidgetV2]]After reviewing {{review_times}} times', translation, {  
                      review_times: valueFormat  
                    });  
              case MILESTONE_REFERRAL:  
                return isSingular  
                  ? i18n('[[WidgetV2]]After referring {{referral_times}} friend', translation, {  
                      referral_times: valueFormat  
                    })  
                  : i18n('[[WidgetV2]]After referring {{referral_times}} friends', translation, {  
                      referral_times: valueFormat  
                    });  
              default:  
                return '';  
            }  
          })();  
  
          const hasReceivedReward = usedMilestoneValues.includes(milestone.value);  
          const isLastMilestone = index === listMilestone.length - 1;  
          const isCurrentMilestone =  
            currentMilestoneIndex !== -1 && index === currentMilestoneIndex;  
          const milestoneValue = Number(milestone.value);  
          const hasPassedMilestone =  
            Number.isFinite(milestoneValue) && currentCustomerValue >= milestoneValue;  
          const shouldShowTooltip = hasPassedMilestone && !hasReceivedReward;  
          const tooltipContent = i18n('[[WidgetV2]]MilestoneCompletedNoRewardTooltip', translation);  
  
          if (showFullContent)  
            return (  
              <div  
                key={index.value}  
                className={`Avada-ProgressMilestone__ContentColumn ${isLastMilestone && 'last'}`}  
              >  
                <div                  className={['Avada-Progress__Circle', hasPassedMilestone && 'active']  
                    .filter(Boolean)  
                    .join(' ')}  
                >  
                  <IconProgressMilestone                    typeMilestone={program.typeMilestone}  
                    smallSize={!showFullContent}  
                  />  
                </div>                {index !== listMilestone.length - 1 && (  
                  <div  
                    className={['Avada-Progress__Column', hasPassedMilestone && 'active']  
                      .filter(Boolean)  
                      .join(' ')}  
                  />  
                )}  
                <div className={'Avada-ProgressMilestone__Value'}>  
                  <Typography                    variant="h5"  
                    component="span"  
                    noWrap={false}  
                    className={'Avada-Preview__TextBold'}  
                  >  
                    {subs}  
                    {shouldShowTooltip && (  
                      <JoyTooltip  
                        direction="top"  
                        theme="dark"  
                        content={tooltipContent}  
                        size="small"  
                      >  
                        <span className="Avada-ProgressMilestone__completedIcon">  
                          <InfoOutlinedIcon fontSize="small" />  
                        </span>                      </JoyTooltip>                    )}  
                  </Typography>  
                  <ul className={'Avada-ProgressMilestone__ListValue'}>  
                    {contents.map((content, indexContent) => (  
                      <li key={indexContent}>  
                        <Typography                          color="textSecondary"  
                          variant="h6"  
                          component="span"  
                          noWrap={false}  
                        >  
                          {content}  
                        </Typography>  
                      </li>                    ))}  
                  </ul>  
                  {isCurrentMilestone &&  
                    (() => {  
                      const {  
                        percentProgress,  
                        unit,  
                        neededForNextMilestone  
                      } = getProgressMilestoneCustomer({  
                        shop,  
                        dataCustomerMilestone: finalDataCustomerMilestone,  
                        program,  
                        settings,  
                        currentMilestone: milestone,  
                        translation  
                      });  
                      return (  
                        <Box style={{width: '260px'}}>  
                          <BorderLinearProgress                            variant="determinate"  
                            value={percentProgress > 100 ? 100 : percentProgress}  
                          />  
                          <Box className={'Avada-ProgressMilestone__detail'}>  
                            <Typography                              component="span"  
                              className={'Avada-ProgressMilestone__completed'}  
                            >  
                              {percentProgress > 100 ? 100 : parseInt(percentProgress)}%{' '}  
                              {i18n('[[WidgetV2]]Completed', translation).toLowerCase()}  
                            </Typography>  
                            {percentProgress < 100 && (  
                              <Typography component="span">  
                                {i18n('Need {{neededForNextMilestone}} {{unit}}', translation, {  
                                  neededForNextMilestone,  
                                  unit  
                                })}  
                              </Typography>  
                            )}  
                          </Box>  
                        </Box>                      );  
                    })()}  
                </div>  
              </div>            );  
  
          return (  
            <div key={index.value} className={'Avada-ProgressMilestone__Content'}>  
              <div                className={`Avada-Progress__Circle ${hasPassedMilestone ? 'milestone_active' : ''}`}  
              >  
                <IconProgressMilestone                  typeMilestone={program.typeMilestone}  
                  smallSize={!showFullContent}  
                />  
              </div>            </div>          );  
        })}  
      </div>  
    </div>  );  
}  
  
export default ProgressMilestone;