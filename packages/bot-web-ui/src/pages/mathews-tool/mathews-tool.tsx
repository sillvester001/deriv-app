import React from 'react';
import { Icon, SelectNative, Input, Button, Checkbox } from '@deriv/components';

// TODO: Move styles to a dedicated .scss file and import it.
const MathewsTool = () => {
    const styles: { [key: string]: React.CSSProperties } = {
        topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' },
        symbolPriceContainer: { display: 'flex', alignItems: 'center' },
        currentPrice: { textAlign: 'center' as const, marginLeft: '20px' },
        buttonsContainer: { display: 'flex' },
        mainContent: { display: 'flex', padding: '10px', flexWrap: 'wrap' as const },
        panel: { flex: '1 1 45%', border: '1px solid #ccc', padding: '10px', margin: '5px', minWidth: '300px' },
        progressGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))', gap: '5px', marginTop: '10px' },
        progressItem: { border: '1px solid #ddd', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', alignItems: 'center', fontSize: '0.8em' },
        formGroup: { marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' as const },
        label: { marginRight: '5px' },
        inputField: { marginRight: '10px', marginBottom: '5px' },
        settingsIconContainer: { cursor: 'pointer', marginLeft: '10px' }, // Changed from style to container for Icon
        pieChartPlaceholder: { width: '200px', height: '200px', border: '1px dashed #aaa', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px auto' }
    };

    const volatilityOptions = [
        { value: 'R_100', text: 'Volatility 100 Index' },
        { value: '1HZ100V', text: 'Volatility 100 (1s) Index' },
        // Add other options from HTML manually here if needed
    ];

    const tickOptions = Array.from({ length: 9 }, (_, i) => ({ value: (i + 1).toString(), text: (i + 1).toString() }));

    return (
        <div className='main_analysis'>
            <div className='main_app'>
                {/* Top Bar */}
                <div style={styles.topBar} className='top_bar'>
                    <div style={styles.symbolPriceContainer} className='symbol_price'>
                        <div className='active_symbol' style={styles.inputField}>
                            <SelectNative list_items={volatilityOptions} value='R_100' />
                        </div>
                        <div className='no_of_ticks' style={styles.inputField}>
                            <label htmlFor='no_of_ticks_input' style={styles.label}>No. of Ticks</label>
                            <Input id='no_of_ticks_input' type='number' defaultValue='1000' width='80px' />
                        </div>
                        <div style={styles.currentPrice} className='current_price'>
                            <h4>CURRENT TICK</h4>
                            <h3>1581.82</h3>
                        </div>
                    </div>
                    <div style={styles.buttonsContainer} className='buttons'>
                        <Button text='Digits' primary />
                        <Button text='Over/Under' style={{ marginLeft: '5px' }} />
                        <Button text='Rise/Fall' style={{ marginLeft: '5px' }} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={styles.mainContent} className='pie_diff'>
                    {/* Left Panel: Differs/Matches */}
                    <div style={styles.panel} className='digit_diff card3'>
                        <h2 className='analysis_title'>Differs/Matches</h2>
                        <div className='title_oc_trader'>
                            <div className='oneclick_trader'>
                                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px'}} className='differs_choices'>
                                    {/* Checkbox: wrapper_style removed, use className or wrap for styling */}
                                    <Checkbox label='Enable' className='mathewstool-checkbox' /> 
                                    <Checkbox label='Auto Differ' className='mathewstool-checkbox' />
                                </div>
                                <div style={styles.formGroup} className='diff_options'>
                                    {/* SelectNative: style prop removed, use className for styling if needed */}
                                    <SelectNative list_items={[{text: 'Differs', value: 'DIGITDIFF'}, {text: 'Matches', value: 'DIGITMATCH'}]} value='DIGITDIFF' className='mathewstool-select' />
                                    <SelectNative list_items={[{text: 'Auto', value: 'AUTO'}, {text: 'Manual', value: 'MANUAL'}]} value='AUTO' className='mathewstool-select' />
                                </div>
                                <div style={styles.formGroup} className='oneclick_amout'>
                                    <label style={styles.label}>Ticks:</label>
                                    <SelectNative list_items={tickOptions} value='1' className='mathewstool-select' />
                                </div>
                                <div style={styles.formGroup} className='oneclick_amout'>
                                    <label style={styles.label}>Stake:</label>
                                    {/* Input: style prop removed, use className for styling if needed */}
                                    <Input type='number' defaultValue='0.5' className='mathewstool-input' />
                                </div>
                                <div style={styles.formGroup} className='differs_setting'>
                                    <div className='martingale' style={styles.inputField}>
                                        <label style={styles.label}>Martingale:</label>
                                        <Input type='number' defaultValue='1.2' className='mathewstool-input' />
                                    </div>
                                    {/* Icon: style prop removed, wrapped in a div for styling */}
                                    <div style={styles.settingsIconContainer} className='guide'> 
                                        <Icon icon='IcSetting' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={styles.progressGrid} className='differs_container'>
                                {Array.from({ length: 10 }).map((_, idx) => (
                                    <div key={idx} style={styles.progressItem} className='progress'>
                                        <h3>{idx}</h3>
                                        <h4>{/* % */}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Even/Odd */}
                    <div style={styles.panel} className='pie card4'>
                        <div className='odd_even_info'>
                            <h2 className='analysis_title'>Even/Odd</h2>
                            <div style={styles.formGroup} className='odd_even_settings'>
                                <Checkbox label='Enable' className='mathewstool-checkbox' />
                                <SelectNative list_items={[{text:'Even', value:'DIGITEVEN'}, {text:'Odd', value:'DIGITODD'}, {text:'Both', value:'BOTH'}]} value='DIGITEVEN' className='mathewstool-select' />
                                <label style={styles.label}>Martingale:</label>
                                <Input type='number' defaultValue='1.2' className='mathewstool-input' />
                                <label style={styles.label}>% value:</label>
                                <Input type='number' defaultValue='60' className='mathewstool-input' />
                                <div style={styles.settingsIconContainer} className='guide'>
                                    <Icon icon='IcSetting' />
                                </div>
                            </div>
                            <div style={styles.formGroup} className='same_diff'>
                                <SelectNative list_items={[{text:'Same', value:'SAME'}, {text:'Opposite', value:'OPPOSITE'}]} value='SAME' className='mathewstool-select' />
                                <div className='tick_stake' style={{ display: 'flex', alignItems: 'center', marginTop: '10px'}}>
                                    <div style={styles.formGroup} className='oneclick_amout'>
                                        <label style={styles.label}>Ticks:</label>
                                        <SelectNative list_items={tickOptions} value='1' className='mathewstool-select' />
                                    </div>
                                    <div style={styles.formGroup} className='oneclick_amout'>
                                        <label style={styles.label}>Stake:</label>
                                        <Input type='number' defaultValue='0.5' className='mathewstool-input' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={styles.pieChartPlaceholder} className='pie_container'>
                            <div>Pie Chart Placeholder</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MathewsTool; 