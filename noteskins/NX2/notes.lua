--[[TO-DO] -------------------------------------------------------------------------------------------------
CM20200606:	Set a different position for the holds behind the tap notes.
--]] -------------------------------------------------------------------------------------------------------

--[[UPDATES] -----------------------------------------------------------------------------------------------
CM20200523:	Removing bottomcap trying to fix glitch graphics.
CM20200524:	Success!
			Glitches are still an issue, I will resize graphics to 
			see if it helps.
			It worked, the problem was 'pixels_after_note'.
			When hold is not long enough it draws the tail at the
			back of the tapnote, it looks ugly...
			Added zoom commands to remove filename tags.
			Added routine taps.
CM20200606:	Added routine rolls.
			Added routine holds.
			Went back to bottomcaps.
			Added custom column size.
			Usign roll graphic for lifts.
			Added some indentation.
--]] -------------------------------------------------------------------------------------------------------



local skin_name = Var("skin_name");
return function(button_list, stepstype, skin_parameters)
	local tap_states= NoteSkin.single_quanta_state_map{1, 2, 3, 4, 5, 6}
	
	local routine_states = {
		parts_per_beat = 48,
		quanta = {
			{per_beat = 1, states = {1, 2, 3, 4, 5, 6}},
			{per_beat = 2, states = {7, 8, 9, 10, 11, 12}},
			{per_beat = 3, states = {13, 14, 15, 16, 17, 18}},
			{per_beat = 4, states = {19, 20, 21, 22, 23, 24}},
		},
	}
	
	local columnSizeTable = {
		StepsType_Pump_Single = {
			width		= 64,
			padding		= -14,
		},
		StepsType_Pump_Halfdouble = {
			width		= 64,
			padding		= 0,
			position	= {-126, -76, -26, 26, 76, 126},
		},
		StepsType_Pump_Double = {
			width		= 64,
			padding		= 0,
			position	= {-226, -176, -126, -76, -26, 26, 76, 126, 176, 226},
		},
		StepsType_Pump_Couple = {
			width		= 64,
			padding		= -14,
		},
		StepsType_Pump_Routine = {
			width		= 64,
			padding		= 0,
			position	= {-226, -176, -126, -76, -26, 26, 76, 126, 176, 226},
		},
	}
	
	-- local bef_note= {
		-- DownLeftStepNote = 0,
		-- UpLeft = 0,
		-- Center = 0,
		-- UpRight = 0,
		-- DownRight = 0,
	-- }
	
	local function hold_length(button)
		return {
			start_note_offset	= 0,
			end_note_offset		= 0.5,
			head_pixs			= 0,
			body_pixs			= 64,
			tail_pixs			= 64,
		}
	end
	local function a_hold(tex,states,button,flip_mode)
		return {
			state_map	= states,
			textures	= {tex},
			length_data	= hold_length(button),
			flip		= flip_mode,
		}
	end
	local function holds (tex,states,button,flip_mode)
		return {	
			TapNoteSubType_Hold= {
				a_hold(tex,states,button,flip_mode),
				a_hold(tex,states,button,flip_mode),
			},
			TapNoteSubType_Roll= {
				a_hold(tex,states,button,flip_mode),
				a_hold(tex,states,button,flip_mode),
			},
		}
	end
	local columns= {}
	for i, button in ipairs(button_list) do
		local column_state = tap_states;
		local tap_tex = NOTESKIN:get_path(skin_name, "HD/" .. button.." TapNote");
		local roll_tex = NOTESKIN:get_path(skin_name, "HD/" .. button.." Roll");
		local hold_tex = NOTESKIN:get_path(skin_name, "HD/" .. button.." Hold");
		local column_position = columnSizeTable[stepstype].position and columnSizeTable[stepstype].position[i];

		if GAMEMAN:stepstype_is_multiplayer(stepstype) then
			column_state = routine_states;
			tap_tex = NOTESKIN:get_path(skin_name, "HD/Routine/"..button.." TapNote");
			roll_tex = NOTESKIN:get_path(skin_name, "HD/Routine/"..button.." Roll");
			hold_tex = NOTESKIN:get_path(skin_name, "HD/Routine/"..button.." Hold");
		end
		
		columns[i]= {
			width= columnSizeTable[stepstype].width, 
			-- width= 64, 
			padding= columnSizeTable[stepstype].padding,
			-- padding= -14,
			custom_x = column_position,
			hold_gray_percent=1,
			anim_uses_beats= false,
			anim_time= 0.3,
			taps= {
			
				NoteSkinTapPart_Tap= {
					state_map= column_state,
					actor= Def.Sprite{
						Texture= tap_tex,
						InitCommand= function(self) self:zoom(1/1.5) end,
					}
				},
				
				NoteSkinTapPart_Mine= {
					state_map= tap_states,
					actor= Def.Sprite{
						Texture= NOTESKIN:get_path(skin_name, "Mine"),
						InitCommand= function(self) self:zoom(1/1.5) end,
					}
				},
				
				NoteSkinTapPart_Lift= {
					state_map= tap_states,
					actor= Def.Sprite{
						Texture= tap_tex,
						InitCommand= function(self) self:zoom(1/1.5) end,
					}
				},
							
			},
			optional_taps= {
				-- NoteSkinTapOptionalPart_HoldTail= {
					-- state_map= tap_states,
					-- actor= Def.Sprite{
						-- Texture= button.." Tail",
						-- InitCommand= function(self) self:zoom(1/1.5) end,
					-- },
				-- },
				NoteSkinTapOptionalPart_RollHead= {
					state_map= tap_states,
					actor= Def.Sprite{
						Texture= roll_tex,
						InitCommand= function(self) self:zoom(1/1.5) end,
					},
				},
				-- NoteSkinTapOptionalPart_RollTail= {
					-- state_map= tap_states,
					-- actor= Def.Sprite{
						-- Texture= button.." Tail",
						-- InitCommand= function(self) self:zoom(1/1.5) end,
					-- },
				-- },
				-- NoteSkinTapOptionalPart_CheckpointTail= {
					-- state_map= tap_states,
					-- actor= Def.Sprite{
						-- Texture= button.." Tail",
						-- InitCommand= function(self) self:zoom(1/1.5) end,
					-- },
				-- },
			},
			holds= holds(hold_tex,column_state,button,"TexCoordFlipMode_None"),
			reverse_holds= holds(hold_tex,column_state,button,"TexCoordFlipMode_X"),
		}
	end
	return {columns= columns, vivid_operation= true}
end
