```js
import React, {useContext, useEffect, useMemo, useState} from 'react';  
  
import './progressMilestone.scss';  
import IconProgressMilestone from '@avada/assets/src/components/Icon/IconProgressMilestone';  
import {  
  MILESTONE_AMOUNT_SPEND,  
  MILESTONE_EARNED_POINT,  
  MILESTONE_ORDER,  
  MILESTONE_REFERRAL,  
  MILESTONE_REVIEWS  
} from '@avada/functions/src/const/programs/milestoneTypes';  
import {formatNumber} from '@avada/utils/lib/formatNumber';  
import {sortArrayObject} from '@avada/utils/lib/sortArrayObject';  
import getStateMilestone from '@avada/assets/src/helpers/program/getStateMilestone';  
import formatCurrencySymbol from '@avada/functions/src/helpers/currency/formatCurrencySymbol';  
import i18n from '@avada/functions/src/helpers/translation/i18n';  
import isSingularValue from '@avada/assets/src/helpers/isSingularValue';  
import {BlocksContext} from '@avada/assets/src/contexts/BlocksContext';  
import getContentProgressMilestone from '@avada/functions/src/helpers/milestone/getContentProgressMilestone';  
import Skeleton from '@material-ui/lab/Skeleton';  
import {Box} from '@material-ui/core';  
import {getProgressMilestoneCustomer} from '@avada/assets/src/helpers/customer/getProgressMilestoneCustomer';  
import {BorderLinearProgress} from '@avada/assets/src/components/ProgressMilestone/BorderLinearProgress';  
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';  
import JoyTooltip from '@avada/assets/src/components/JoyTooltip/JoyTooltip';  
import displayMoneyValue from '@avada/functions/src/helpers/program/displayMoney';  
  
function ProgressMilestone({program, setToast}) {  
  const {settings, currentCustomer, shop, isPreview, translation, blockSettings, get} = useContext(  
    BlocksContext  
  );  
  
  const {milestones = [], typeMilestone} = program;  
  const listMilestone = milestones.sort(sortArrayObject('value'));  
  const {blockTextColor} = settings;  
  const [loadingDataCustomer, setLoadingDataCustomer] = useState(false);  
  const [dataCustomerMilestone, setDataCustomerMilestone] = useState({});  
  
  const {state: currentActive} = getStateMilestone({  
    program,  
    customer: currentCustomer,  
    isPreview,  
    isLoggedIn: currentCustomer?.id  
  });  
  
  const usedMilestoneValues = useMemo(() => {  
    if (!currentCustomer) return [];  
    const milestoneUsageMap = {  
      [MILESTONE_ORDER]: currentCustomer.usedMilestoneOrder ?? [],  
      [MILESTONE_EARNED_POINT]: currentCustomer.usedMilestoneEarnPoint ?? [],  
      [MILESTONE_AMOUNT_SPEND]: currentCustomer.usedMilestoneSpentAmount ?? [],  
      [MILESTONE_REVIEWS]: currentCustomer.usedMilestoneReview ?? [],  
      [MILESTONE_REFERRAL]: currentCustomer.usedMilestoneReferral ?? []  
    };  
  
    const values = milestoneUsageMap[program.typeMilestone] ?? [];  
    return Array.isArray(values) ? values : [];  
  }, [currentCustomer, program?.typeMilestone]);  
  
  const currentCustomerValue = useMemo(() => {  
    if (!dataCustomerMilestone || typeof dataCustomerMilestone !== 'object') {  
      return 0;  
    }  
    switch (program.typeMilestone) {  
      case MILESTONE_ORDER:  
        return dataCustomerMilestone[MILESTONE_ORDER] || 0;  
      case MILESTONE_AMOUNT_SPEND:  
        return dataCustomerMilestone[MILESTONE_AMOUNT_SPEND] || 0;  
      case MILESTONE_EARNED_POINT:  
        return dataCustomerMilestone[MILESTONE_EARNED_POINT] || 0;  
      case MILESTONE_REVIEWS:  
        return dataCustomerMilestone[MILESTONE_REVIEWS] || 0;  
      case MILESTONE_REFERRAL:  
        return dataCustomerMilestone[MILESTONE_REFERRAL] || 0;  
      default:  
        return 0;  
    }  
  }, [dataCustomerMilestone, program.typeMilestone]);  
  
  const currentMilestoneIndex = useMemo(() => {  
    return listMilestone.findIndex(m => {  
      const milestoneValue = Number(m.value);  
      return Number.isFinite(milestoneValue) && currentCustomerValue < milestoneValue;  
    });  
  }, [listMilestone, currentCustomerValue]);  
  
  const getDataCustomerForMilestone = async () => {  
    try {  
      setLoadingDataCustomer(true);  
      const {data} = await get({path: '/customer-milestone?type=' + typeMilestone});  
      setDataCustomerMilestone(data);  
    } catch (error) {  
      console.log('Error fetching total reviews:', error);  
    } finally {  
      setLoadingDataCustomer(false);  
    }  
  };  
  
  useEffect(() => {  
    getDataCustomerForMilestone().then();  
  }, []);  
  
  if (loadingDataCustomer) {  
    return (  
      <Box>  
        <Skeleton width={200} />  
        <Skeleton width={200} />  
        <Skeleton width={200} />  
      </Box>    );  
  }  
  
  return (  
    <div  
      className={`Avada-LoyaltyPage__ProgressMilestone column`}  
      id={`avada-${program.id}`}  
      style={{  
        '--Avada-block-bg-color': blockSettings['joy-way-to-earn-icon-color'],  
        '--Avada-block-text-color': blockTextColor  
      }}  
      key={`avada-${program.id}`}  
    >  
      <div className={'Avada-LoyaltyPage__ProgressMilestone--Container'}>  
        {listMilestone.map((milestone, index) => {  
          const {value, contents} = getContentProgressMilestone({  
            shop,  
            milestone,  
            settings,  
            translation  
          });  
  
          const subs = (() => {  
            const valueFormat = formatNumber(parseFloat(value || 0), 2);  
            const isSingular = isSingularValue(value);  
  
            switch (program.typeMilestone) {  
              case MILESTONE_ORDER:  
                return i18n(  
                  `[[WidgetV2]]After completing {{order_amount}} order${isSingular ? '' : 's'}`,  
                  translation,  
                  {  
                    order_amount: valueFormat  
                  }  
                );  
  
              case MILESTONE_AMOUNT_SPEND:  
                const currency = formatCurrencySymbol(  
                  window?.Shopify?.currency?.active || shop?.currency || 'USD'  
                );  
                return i18n('[[WidgetV2]]After spending {{spent_amount}}', translation, {  
                  spent_amount: displayMoneyValue({money: value, currency, settings})  
                });  
              case MILESTONE_EARNED_POINT:  
                return i18n(  
                  '[[WidgetV2]]After earning {{earned_points}} {{loyalty_point}}',  
                  translation,  
                  {  
                    earned_points: valueFormat,  
                    loyalty_point: isSingular ? settings.pointSingular : settings.pointPlural  
                  }  
                );  
  
              case MILESTONE_REVIEWS:  
                return i18n(  
                  `[[WidgetV2]]After reviewing {{review_times}} time${isSingular ? '' : 's'}`,  
                  translation,  
                  {  
                    review_times: valueFormat  
                  }  
                );  
              case MILESTONE_REFERRAL:  
                return i18n(  
                  `[[WidgetV2]]After referring {{referral_times}} friend${isSingular ? '' : 's'}`,  
                  translation,  
                  {  
                    referral_times: valueFormat  
                  }  
                );  
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
  
          return (  
            <div  
              key={index.value}  
              className={[  
                'Avada-LoyaltyPage__ProgressMilestone--ContentColumn',  
                isLastMilestone && 'last'  
              ]  
                .filter(Boolean)  
                .join(' ')}  
            >  
              <div                className={[  
                  'Avada-LoyaltyPage__ProgressMilestone--Circle',  
                  hasPassedMilestone && 'active'  
                ]  
                  .filter(Boolean)  
                  .join(' ')}  
              >  
                <IconProgressMilestone typeMilestone={program.typeMilestone} smallSize={false} />  
              </div>              {index !== listMilestone.length - 1 && (  
                <div  
                  className={[  
                    'Avada-LoyaltyPage__ProgressMilestone--Column',  
                    hasPassedMilestone && 'active'  
                  ]  
                    .filter(Boolean)  
                    .join(' ')}  
                />  
              )}  
              <div className={'Avada-LoyaltyPage__ProgressMilestone--Value'}>  
                <h6 className={'Avada-Preview__TextBold'}>  
                  {subs}  
                  {shouldShowTooltip && (  
                    <JoyTooltip direction="top" theme="dark" content={tooltipContent} size="small">  
                      <span className="Avada-ProgressMilestone__completedIcon">  
                        <InfoOutlinedIcon fontSize="small" />  
                      </span>                    </JoyTooltip>                  )}  
                </h6>  
                <ul className={'Avada-LoyaltyPage__ProgressMilestone--listValue'}>  
                  {contents.map((content, indexContent) => (  
                    <li key={indexContent}>  
                      <h5>{content}</h5>  
                    </li>                  ))}  
                </ul>  
                {isCurrentMilestone &&  
                  (() => {  
                    const {  
                      percentProgress,  
                      unit,  
                      neededForNextMilestone  
                    } = getProgressMilestoneCustomer({  
                      shop,  
                      dataCustomerMilestone,  
                      program,  
                      settings,  
                      currentMilestone: milestone,  
                      translation  
                    });  
                    return (  
                      <Box style={{width: '260px'}}>  
                        <BorderLinearProgress                          variant="determinate"  
                          value={percentProgress > 100 ? 100 : percentProgress}  
                        />  
                        <Box className={'Avada-LoyaltyPage__ProgressMilestone--detail'}>  
                          <span>                            {percentProgress > 100 ? 100 : parseInt(percentProgress)}%{' '}  
                            {i18n('[[WidgetV2]]Completed', translation).toLowerCase()}  
                          </span>  
                          {percentProgress < 100 && (  
                            <span>  
                              {i18n('Need {{neededForNextMilestone}} {{unit}}', translation, {  
                                neededForNextMilestone,  
                                unit  
                              })}  
                            </span>  
                          )}  
                        </Box>  
                      </Box>                    );  
                  })()}  
              </div>  
            </div>          );  
        })}  
      </div>  
    </div>  );  
}  
  
export default ProgressMilestone;
```